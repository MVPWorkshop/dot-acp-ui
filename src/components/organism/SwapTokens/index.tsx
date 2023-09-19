import { t } from "i18next";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { ActionType, ButtonVariants, InputEditedType, TokenSelection } from "../../../app/types/enum";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapSelectTokenModal from "../SwapSelectTokenModal";
import {
  swapNativeForAssetExactIn,
  swapNativeForAssetExactOut,
  swapAssetForAssetExactIn,
  swapAssetForAssetExactOut,
} from "../../../services/swapServices";
import {
  getAssetTokenFromNativeToken,
  getNativeTokenFromAssetToken,
  getAssetTokenAFromAssetTokenB,
  getAssetTokenBFromAssetTokenA,
} from "../../../services/tokenServices";
import {
  formatInputTokenValue,
  formatDecimalsFromToken,
  calculateSlippageReduce,
  calculateSlippageAdd,
} from "../../../app/util/helper";
import { getPoolReserves } from "../../../services/poolServices";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import classNames from "classnames";
import { InputEditedProps } from "../../../app/types";

type TokenProps = {
  tokenSymbol: string;
  tokenId: string | null;
  decimals: string;
  tokenBalance: string;
};

type SwapTokenProps = {
  tokenA: TokenProps;
  tokenB: TokenProps;
};

type TokenValueProps = {
  tokenValue: number;
};

type TokenValueSlippageProps = {
  tokenValue: number;
};

const SwapTokens = () => {
  const { state, dispatch } = useAppContext();
  const { tokenBalances, pools, api, selectedAccount, swapFinalized } = state;
  const [tokenSelectionModal, setTokenSelectionModal] = useState<TokenSelection>(TokenSelection.None);
  const [selectedTokens, setSelectedTokens] = useState<SwapTokenProps>({
    tokenA: {
      tokenSymbol: "",
      tokenId: "0",
      decimals: "",
      tokenBalance: "",
    },
    tokenB: {
      tokenSymbol: "",
      tokenId: "0",
      decimals: "",
      tokenBalance: "",
    },
  });

  const [inputEdited, setInputEdited] = useState<InputEditedProps>({ inputType: InputEditedType.exactIn });
  const [selectedTokenAValue, setSelectedTokenAValue] = useState<TokenValueProps>({
    tokenValue: 0,
  });
  const [selectedTokenBValue, setSelectedTokenBValue] = useState<TokenValueProps>({
    tokenValue: 0,
  });
  const [tokenAValueForSwap, setTokenAValueForSwap] = useState<TokenValueSlippageProps>({
    tokenValue: 0,
  });
  const [tokenBValueForSwap, setTokenBValueForSwap] = useState<TokenValueSlippageProps>({
    tokenValue: 0,
  });
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);
  const [slippageValue, setSlippageValue] = useState<number>(10);
  const [walletHasEnoughWnd, setWalletHasEnoughWnd] = useState<boolean>(false);
  const [availablePoolTokens, setAvailablePoolTokens] = useState<any[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const nativeToken = {
    tokenId: "",
    assetTokenMetadata: {
      symbol: tokenBalances?.tokenSymbol as string,
      name: tokenBalances?.tokenSymbol as string,
      decimals: tokenBalances?.tokenDecimals as string,
    },
    tokenAsset: {
      balance: tokenBalances?.balance,
    },
  };

  const getPriceOfAssetTokenFromNativeToken = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(
        value,
        selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
          ? selectedTokens.tokenA.decimals
          : selectedTokens.tokenB.decimals
      );

      const assetTokenPrice = await getAssetTokenFromNativeToken(
        api,
        selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
          ? selectedTokens?.tokenB?.tokenId
          : selectedTokens?.tokenA?.tokenId,
        valueWithDecimals
      );

      if (assetTokenPrice) {
        const assetTokenNoSemicolons = assetTokenPrice.toString().replace(/[, ]/g, "");
        const assetTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(assetTokenNoSemicolons),
          selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
            ? selectedTokens.tokenB.decimals
            : selectedTokens.tokenA.decimals
        );

        const assetTokenWithSlippage =
          inputEdited.inputType === InputEditedType.exactIn
            ? calculateSlippageReduce(assetTokenNoDecimals, slippageValue)
            : calculateSlippageAdd(assetTokenNoDecimals, slippageValue);

        if (inputEdited.inputType === InputEditedType.exactIn) {
          setTokenAValueForSwap({ tokenValue: value });
          setTokenBValueForSwap({ tokenValue: assetTokenWithSlippage });
          setSelectedTokenBValue({ tokenValue: assetTokenNoDecimals });
        } else if (inputEdited.inputType === InputEditedType.exactOut) {
          setTokenAValueForSwap({ tokenValue: assetTokenWithSlippage });
          setTokenBValueForSwap({ tokenValue: value });
          setSelectedTokenAValue({ tokenValue: assetTokenNoDecimals });
        }
      }
    }
  };

  const getPriceOfNativeTokenFromAssetToken = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(
        value,
        selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
          ? selectedTokens.tokenB.decimals
          : selectedTokens.tokenA.decimals
      );

      const nativeTokenPrice = await getNativeTokenFromAssetToken(
        api,
        selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
          ? selectedTokens?.tokenB?.tokenId
          : selectedTokens?.tokenA.tokenId,
        valueWithDecimals
      );

      if (nativeTokenPrice) {
        const nativeTokenNoSemicolons = nativeTokenPrice.toString().replace(/[, ]/g, "");
        const nativeTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(nativeTokenNoSemicolons),
          selectedTokens?.tokenA?.tokenSymbol === TokenSelection.NativeToken
            ? selectedTokens.tokenA.decimals
            : selectedTokens.tokenB.decimals
        );

        const nativeTokenWithSlippage =
          inputEdited.inputType === InputEditedType.exactIn
            ? calculateSlippageReduce(nativeTokenNoDecimals, slippageValue)
            : calculateSlippageAdd(nativeTokenNoDecimals, slippageValue);

        if (tokenBalances?.balance) {
          setWalletHasEnoughWnd(value <= tokenBalances?.balance);

          if (inputEdited.inputType === InputEditedType.exactIn) {
            setTokenAValueForSwap({ tokenValue: value });
            setTokenBValueForSwap({ tokenValue: nativeTokenWithSlippage });
            setSelectedTokenBValue({ tokenValue: nativeTokenNoDecimals });
          } else if (inputEdited.inputType === InputEditedType.exactOut) {
            setTokenAValueForSwap({ tokenValue: nativeTokenWithSlippage });
            setTokenBValueForSwap({ tokenValue: value });
            setSelectedTokenAValue({ tokenValue: nativeTokenNoDecimals });
          }
        }
      }
    }
  };

  const getPriceOfAssetTokenAFromAssetTokenB = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(value, selectedTokens.tokenB.decimals);
      if (selectedTokens.tokenA.tokenId && selectedTokens.tokenB.tokenId) {
        const assetTokenPrice = await getAssetTokenAFromAssetTokenB(
          api,
          valueWithDecimals,
          selectedTokens.tokenA.tokenId,
          selectedTokens.tokenB.tokenId
        );
        if (assetTokenPrice) {
          const assetTokenNoSemicolons = assetTokenPrice.toString().replace(/[, ]/g, "");
          const assetTokenNoDecimals = formatDecimalsFromToken(
            parseFloat(assetTokenNoSemicolons),
            selectedTokens.tokenA.decimals
          );
          const assetTokenWithSlippage = calculateSlippageAdd(assetTokenNoDecimals, slippageValue);

          setTokenAValueForSwap({ tokenValue: assetTokenWithSlippage });
          setTokenBValueForSwap({ tokenValue: value });
          setSelectedTokenAValue({ tokenValue: assetTokenNoDecimals });
        }
      }
    }
  };

  const getPriceOfAssetTokenBFromAssetTokenA = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(value, selectedTokens.tokenA.decimals);
      if (selectedTokens.tokenA.tokenId && selectedTokens.tokenB.tokenId) {
        const assetTokenPrice = await getAssetTokenBFromAssetTokenA(
          api,
          valueWithDecimals,
          selectedTokens.tokenA.tokenId,
          selectedTokens.tokenB.tokenId
        );

        if (assetTokenPrice) {
          const assetTokenNoSemicolons = assetTokenPrice.toString().replace(/[, ]/g, "");
          const assetTokenNoDecimals = formatDecimalsFromToken(
            parseFloat(assetTokenNoSemicolons),
            selectedTokens.tokenB.decimals
          );

          const assetTokenWithSlippage = calculateSlippageReduce(assetTokenNoDecimals, slippageValue);

          setTokenAValueForSwap({ tokenValue: value });
          setTokenBValueForSwap({ tokenValue: assetTokenWithSlippage });
          setSelectedTokenBValue({ tokenValue: assetTokenNoDecimals });
        }
      }
    }
  };

  const tokenAValue = async (value: number) => {
    const baseString = value.toString();
    if (baseString.includes(".")) {
      if (baseString.split(".")[1].length > parseInt(selectedTokens.tokenA.decimals)) {
        console.log("too many decimals");
        // todo: write error message
        return;
      }
    }
    setSelectedTokenAValue({ tokenValue: value });
    setInputEdited({ inputType: InputEditedType.exactIn });
    if (selectedTokenAValue) {
      if (selectedTokens.tokenA.tokenSymbol === TokenSelection.NativeToken) {
        getPriceOfAssetTokenFromNativeToken(value);
        if (tokenBalances?.balance) {
          setWalletHasEnoughWnd(value <= tokenBalances?.balance);
        }
      } else if (selectedTokens.tokenB.tokenSymbol === TokenSelection.NativeToken) {
        getPriceOfNativeTokenFromAssetToken(value);
        if (tokenBalances?.balance) {
          setWalletHasEnoughWnd(value <= tokenBalances?.balance);
        }
      } else {
        getPriceOfAssetTokenBFromAssetTokenA(value);
      }
    }
  };

  const tokenBValue = async (value: number) => {
    const baseString = value.toString();
    if (baseString.includes(".")) {
      if (baseString.split(".")[1].length > parseInt(selectedTokens.tokenB.decimals)) {
        console.log("too many decimals");
        // todo: write error message
        return;
      }
    }
    setSelectedTokenBValue({ tokenValue: value });
    setInputEdited({ inputType: InputEditedType.exactOut });
    if (selectedTokenBValue) {
      if (selectedTokens.tokenA.tokenSymbol === TokenSelection.NativeToken) {
        getPriceOfNativeTokenFromAssetToken(value);
      } else if (selectedTokens.tokenB.tokenSymbol === TokenSelection.NativeToken) {
        getPriceOfAssetTokenFromNativeToken(value);
        if (tokenBalances?.balance) {
          setWalletHasEnoughWnd(value <= tokenBalances?.balance);
        }
      } else {
        getPriceOfAssetTokenAFromAssetTokenB(value);
      }
    }
  };

  const checkIfSwapIsPossible = () => {
    if (selectedAccount && tokenBalances?.balance) {
      if (!selectedTokens.tokenA || !selectedTokens.tokenB) {
        return t("button.selectToken");
      }
      if (selectedTokenAValue?.tokenValue <= 0) {
        return t("button.enterAmount");
      }
      if (
        walletHasEnoughWnd === false &&
        (selectedTokens.tokenA.tokenSymbol === TokenSelection.NativeToken ||
          selectedTokens.tokenB.tokenSymbol === TokenSelection.NativeToken)
      ) {
        return t("button.insufficientTokenAmount", { token: TokenSelection.NativeToken });
      }
      if (
        (selectedTokens.tokenA.tokenSymbol === TokenSelection.NativeToken ||
          selectedTokens.tokenB.tokenSymbol === TokenSelection.NativeToken) &&
        walletHasEnoughWnd
      ) {
        return t("button.swap");
      }
      if (
        selectedTokens.tokenA.tokenSymbol !== TokenSelection.NativeToken &&
        selectedTokens.tokenB.tokenSymbol !== TokenSelection.NativeToken &&
        selectedTokenAValue.tokenValue > 0 &&
        selectedTokenBValue.tokenValue > 0
      ) {
        return t("button.swap");
      }
    } else {
      return t("button.connectWallet");
    }
  };

  const getPoolTokenPairs = async () => {
    if (api) {
      const poolsAssetTokenIds = pools?.map((pool: any) => {
        if (pool?.[0]?.[1].interior?.X2) {
          const assetTokenIds = pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex.replace(/[, ]/g, "").toString();
          return assetTokenIds;
        }
      });

      const tokens = tokenBalances?.assets?.filter((item: any) => poolsAssetTokenIds.includes(item.tokenId)) || [];

      const assetTokens = [nativeToken]
        .concat(tokens)
        ?.filter(
          (item: any) =>
            item.tokenId !== selectedTokens.tokenA?.tokenId && item.tokenId !== selectedTokens.tokenB?.tokenId
        );

      const poolTokenPairsArray: any[] = [];

      await Promise.all(
        pools.map(async (pool: any) => {
          if (pool?.[0]?.[1]?.interior?.X2) {
            const poolReserve: any = await getPoolReserves(
              api,
              pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex.replace(/[, ]/g, "")
            );

            if (poolReserve?.length > 0) {
              const assetTokenMetadata: any = await api.query.assets.metadata(
                pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex.replace(/[, ]/g, "")
              );

              poolTokenPairsArray.push({
                name: `WND–${assetTokenMetadata.toHuman().symbol}`,
              });
            }
          }
        })
      );

      const assetTokensInPoolTokenPairsArray = poolTokenPairsArray.map((item: any) => item.name.split("–")[1]);

      assetTokensInPoolTokenPairsArray.push(TokenSelection.NativeToken);

      const assetTokensNotInPoolTokenPairsArray = assetTokens.filter((item: any) =>
        assetTokensInPoolTokenPairsArray.includes(item.assetTokenMetadata.symbol)
      );

      return assetTokensNotInPoolTokenPairsArray;
    }
  };

  const handleSwap = async () => {
    if (api) {
      const tokenA = formatInputTokenValue(tokenAValueForSwap.tokenValue, selectedTokens.tokenA.decimals);
      const tokenB = formatInputTokenValue(tokenBValueForSwap.tokenValue, selectedTokens.tokenB.decimals);
      if (selectedTokens.tokenA.tokenSymbol === TokenSelection.NativeToken) {
        if (selectedTokens.tokenB.tokenId) {
          if (inputEdited.inputType === InputEditedType.exactIn) {
            await swapNativeForAssetExactIn(
              api,
              selectedTokens.tokenB.tokenId,
              selectedAccount,
              tokenA,
              tokenB,
              false,
              dispatch
            );
          } else if (inputEdited.inputType === InputEditedType.exactOut) {
            if (selectedTokens.tokenB.tokenId) {
              await swapNativeForAssetExactOut(
                api,
                selectedTokens.tokenB.tokenId,
                selectedAccount,
                tokenA,
                tokenB,
                false,
                dispatch
              );
            }
          }
        }
      } else if (selectedTokens.tokenB.tokenSymbol === TokenSelection.NativeToken) {
        if (selectedTokens.tokenA.tokenId) {
          if (inputEdited.inputType === InputEditedType.exactIn) {
            await swapNativeForAssetExactIn(
              api,
              selectedTokens.tokenA.tokenId,
              selectedAccount,
              tokenB,
              tokenA,
              true,
              dispatch
            );
          } else if (inputEdited.inputType === InputEditedType.exactOut) {
            await swapNativeForAssetExactOut(
              api,
              selectedTokens.tokenA.tokenId,
              selectedAccount,
              tokenB,
              tokenA,
              true,
              dispatch
            );
          }
        }
      } else if (
        selectedTokens.tokenA.tokenSymbol !== TokenSelection.NativeToken &&
        selectedTokens.tokenB.tokenSymbol !== TokenSelection.NativeToken
      ) {
        if (selectedTokens.tokenA.tokenId && selectedTokens.tokenB.tokenId) {
          if (inputEdited.inputType === InputEditedType.exactIn) {
            await swapAssetForAssetExactIn(
              api,
              selectedTokens.tokenA.tokenId,
              selectedTokens.tokenB.tokenId,
              selectedAccount,
              tokenA,
              tokenB,
              dispatch
            );
          } else if (inputEdited.inputType === InputEditedType.exactOut) {
            await swapAssetForAssetExactOut(
              api,
              selectedTokens.tokenA.tokenId,
              selectedTokens.tokenB.tokenId,
              selectedAccount,
              tokenA,
              tokenB,
              dispatch
            );
          }
        }
      }
    }
  };

  const fillTokenPairsAndOpenModal = (tokenInputSelected: TokenSelection) => {
    getPoolTokenPairs().then((res: any) => setAvailablePoolTokens(res));
    setTokenSelectionModal(tokenInputSelected);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: false });
  };

  useEffect(() => {
    if (swapFinalized) setIsSuccessModalOpen(true);
  }, [swapFinalized]);

  return (
    <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
      <h3 className="heading-6 font-unbounded-variable font-normal">{t("swapPage.swap")}</h3>
      <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-b-modal-header-border-color" />
      <TokenAmountInput
        tokenText={selectedTokens.tokenA?.tokenSymbol}
        labelText={t("tokenAmountInput.youPay")}
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenAValue.tokenValue}
        onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenA)}
        onSetTokenValue={(value) => tokenAValue(value)}
        disabled={!selectedAccount}
      />
      <TokenAmountInput
        tokenText={selectedTokens.tokenB?.tokenSymbol}
        labelText={t("tokenAmountInput.youReceive")}
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenBValue.tokenValue}
        onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenB)}
        onSetTokenValue={(value) => tokenBValue(value)}
        disabled={!selectedAccount}
      />

      <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
        <div className="flex w-full flex-row justify-between text-medium font-normal text-text-color-label-light">
          <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
          <span>{slippageValue}%</span>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-full basis-8/12 flex-row rounded-xl bg-white p-1 text-large font-normal text-text-color-header-light">
            <button
              className={classNames("flex basis-1/2 justify-center rounded-lg px-4 py-3", {
                "bg-white": slippageAuto,
                "bg-purple-100": !slippageAuto,
              })}
              onClick={() => {
                setSlippageAuto(true);
                setSlippageValue(10);
              }}
            >
              {t("tokenAmountInput.auto")}
            </button>

            <button
              className={classNames("flex basis-1/2 justify-center rounded-lg px-4 py-3", {
                "bg-white": slippageAuto,
                "bg-purple-100": !slippageAuto,
              })}
              onClick={() => setSlippageAuto(false)}
            >
              {t("tokenAmountInput.custom")}
            </button>
          </div>
          <div className="flex basis-1/3">
            <div className="relative flex">
              <NumericFormat
                value={slippageValue}
                onValueChange={({ value }) => setSlippageValue(parseInt(value) >= 0 ? parseInt(value) : 0)}
                fixedDecimalScale={true}
                thousandSeparator={false}
                allowNegative={false}
                className="w-full rounded-lg bg-purple-100 p-2 text-large  text-text-color-label-light outline-none"
                disabled={slippageAuto}
              />
              <span className="absolute bottom-1/3 right-2 text-medium text-text-color-disabled-light">%</span>
            </div>
          </div>
        </div>
      </div>

      <SwapSelectTokenModal
        open={tokenSelectionModal !== TokenSelection.None}
        title={t("modal.selectToken")}
        tokensData={availablePoolTokens}
        onClose={() => setTokenSelectionModal(TokenSelection.None)}
        onSelect={(tokenData) => {
          setSelectedTokens((prev) => {
            return {
              ...prev,
              [tokenSelectionModal]: tokenData,
            };
          });
          setTokenSelectionModal(TokenSelection.None);
        }}
      />

      <Button
        onClick={() => handleSwap()}
        variant={ButtonVariants.btnInteractivePink}
        disabled={checkIfSwapIsPossible() !== "Swap"}
      >
        {checkIfSwapIsPossible()}
      </Button>

      <SwapAndPoolSuccessModal
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        contentTitle={"Successfully swapped"}
        tokenA={{
          symbol: selectedTokens.tokenA.tokenSymbol,
          value: selectedTokenAValue.tokenValue,
          icon: <DotToken />,
        }}
        tokenB={{
          symbol: selectedTokens.tokenB.tokenSymbol,
          value: selectedTokenBValue.tokenValue,
          icon: <DotToken />,
        }}
        actionLabel="Swapped"
      />
    </div>
  );
};

export default SwapTokens;
