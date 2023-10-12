import classNames from "classnames";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { NumericFormat } from "react-number-format";
import useGetNetwork from "../../../app/hooks/useGetNetwork";
import { InputEditedProps, TokenProps } from "../../../app/types";
import { ActionType, ButtonVariants, InputEditedType, TokenPosition, TokenSelection } from "../../../app/types/enum";
import {
  calculateSlippageAdd,
  calculateSlippageReduce,
  formatDecimalsFromToken,
  formatInputTokenValue,
} from "../../../app/util/helper";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { lottieOptions } from "../../../assets/loader";
import { getPoolReserves } from "../../../services/poolServices";
import {
  checkSwapAssetForAssetExactInGasFee,
  checkSwapAssetForAssetExactOutGasFee,
  checkSwapNativeForAssetExactInGasFee,
  checkSwapNativeForAssetExactOutGasFee,
  swapAssetForAssetExactIn,
  swapAssetForAssetExactOut,
  swapNativeForAssetExactIn,
  swapNativeForAssetExactOut,
} from "../../../services/swapServices";
import {
  getAssetTokenAFromAssetTokenB,
  getAssetTokenBFromAssetTokenA,
  getAssetTokenFromNativeToken,
  getNativeTokenFromAssetToken,
} from "../../../services/tokenServices";
import { getWalletTokensBalance } from "../../../services/polkadotWalletServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import SwapSelectTokenModal from "../SwapSelectTokenModal";
import WarningMessage from "../../atom/WarningMessage";

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

type TokenSelectedProps = {
  tokenSelected: TokenPosition;
};

const SwapTokens = () => {
  const { state, dispatch } = useAppContext();
  const { nativeTokenSymbol } = useGetNetwork();

  const {
    tokenBalances,
    poolsTokenMetadata,
    pools,
    api,
    selectedAccount,
    swapFinalized,
    swapGasFeesMessage,
    swapGasFee,
    swapLoading,
    poolsCards,
    swapExactInTokenAmount,
    swapExactOutTokenAmount,
    assetLoading,
  } = state;

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
  const [slippageValue, setSlippageValue] = useState<number>(15);
  const [walletHasEnoughNativeToken, setWalletHasEnoughNativeToken] = useState<boolean>(false);
  const [availablePoolTokenA, setAvailablePoolTokenA] = useState<TokenProps[]>([]);
  const [availablePoolTokenB, setAvailablePoolTokenB] = useState<TokenProps[]>([]);
  const [tokenSelected, setTokenSelected] = useState<TokenSelectedProps>({ tokenSelected: TokenPosition.tokenA });
  const [assetTokensInPool, setAssetTokensInPool] = useState<string>("");
  const [nativeTokensInPool, setNativeTokensInPool] = useState<string>("");
  const [liquidityLow, setLiquidityLow] = useState<boolean>(false);
  const [swapSuccessfulReset, setSwapSuccessfulReset] = useState<boolean>(false);

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

  const handleSwapNativeForAssetGasFee = async () => {
    const tokenA = formatInputTokenValue(tokenAValueForSwap.tokenValue, selectedTokens.tokenA.decimals);
    const tokenB = formatInputTokenValue(tokenBValueForSwap.tokenValue, selectedTokens.tokenB.decimals);
    if (api) {
      if (inputEdited.inputType === InputEditedType.exactIn) {
        await checkSwapNativeForAssetExactInGasFee(
          api,
          selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol
            ? selectedTokens.tokenB.tokenId
            : selectedTokens.tokenA.tokenId,
          selectedAccount,
          tokenA,
          tokenB,
          false,
          dispatch
        );
      }
      if (inputEdited.inputType === InputEditedType.exactOut) {
        await checkSwapNativeForAssetExactOutGasFee(
          api,
          selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol
            ? selectedTokens.tokenB.tokenId
            : selectedTokens.tokenA.tokenId,
          selectedAccount,
          tokenA,
          tokenB,
          false,
          dispatch
        );
      }
    }
  };

  const handleSwapAssetForAssetGasFee = async () => {
    const tokenA = formatInputTokenValue(tokenAValueForSwap.tokenValue, selectedTokens.tokenA.decimals);
    const tokenB = formatInputTokenValue(tokenBValueForSwap.tokenValue, selectedTokens.tokenB.decimals);
    if (api) {
      if (inputEdited.inputType === InputEditedType.exactIn) {
        await checkSwapAssetForAssetExactInGasFee(
          api,
          selectedTokens.tokenA.tokenId,
          selectedTokens.tokenB.tokenId,
          selectedAccount,
          tokenA,
          tokenB,
          dispatch
        );
      }
      if (inputEdited.inputType === InputEditedType.exactOut) {
        await checkSwapAssetForAssetExactOutGasFee(
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
  };

  const getPriceOfAssetTokenFromNativeToken = async (value: number, inputType: string) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(
        value,
        selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
          ? selectedTokens.tokenA.decimals
          : selectedTokens.tokenB.decimals
      );

      const assetTokenPrice = await getAssetTokenFromNativeToken(
        api,
        selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
          ? selectedTokens?.tokenB?.tokenId
          : selectedTokens?.tokenA?.tokenId,
        valueWithDecimals
      );

      if (assetTokenPrice) {
        const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");
        const assetTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(assetTokenNoSemicolons),
          selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
            ? selectedTokens.tokenB.decimals
            : selectedTokens.tokenA.decimals
        );

        const assetTokenWithSlippage =
          inputType === InputEditedType.exactIn
            ? calculateSlippageReduce(assetTokenNoDecimals, slippageValue)
            : calculateSlippageAdd(assetTokenNoDecimals, slippageValue);

        if (inputType === InputEditedType.exactIn) {
          setTokenAValueForSwap({ tokenValue: value });
          setTokenBValueForSwap({ tokenValue: assetTokenWithSlippage });
          setSelectedTokenBValue({ tokenValue: assetTokenNoDecimals });
        } else if (inputType === InputEditedType.exactOut) {
          setTokenAValueForSwap({ tokenValue: assetTokenWithSlippage });
          setTokenBValueForSwap({ tokenValue: value });
          setSelectedTokenAValue({ tokenValue: assetTokenNoDecimals });
        }
      }
    }
  };

  const getPriceOfNativeTokenFromAssetToken = async (value: number, inputType: string) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(
        value,
        selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
          ? selectedTokens.tokenB.decimals
          : selectedTokens.tokenA.decimals
      );

      const nativeTokenPrice = await getNativeTokenFromAssetToken(
        api,
        selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
          ? selectedTokens?.tokenB?.tokenId
          : selectedTokens?.tokenA.tokenId,
        valueWithDecimals
      );

      if (nativeTokenPrice) {
        const nativeTokenNoSemicolons = nativeTokenPrice.toString()?.replace(/[, ]/g, "");
        const nativeTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(nativeTokenNoSemicolons),
          selectedTokens?.tokenA?.tokenSymbol === nativeTokenSymbol
            ? selectedTokens.tokenA.decimals
            : selectedTokens.tokenB.decimals
        );

        const nativeTokenWithSlippage =
          inputType === InputEditedType.exactIn
            ? calculateSlippageReduce(nativeTokenNoDecimals, slippageValue)
            : calculateSlippageAdd(nativeTokenNoDecimals, slippageValue);

        if (tokenBalances?.balance) {
          if (inputType === InputEditedType.exactIn) {
            setTokenAValueForSwap({ tokenValue: value });
            setTokenBValueForSwap({ tokenValue: nativeTokenWithSlippage });
            setSelectedTokenBValue({ tokenValue: nativeTokenNoDecimals });
          } else if (inputType === InputEditedType.exactOut) {
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
          const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");
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
          const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");
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
      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        getPriceOfAssetTokenFromNativeToken(value, InputEditedType.exactIn);
      } else if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        getPriceOfNativeTokenFromAssetToken(value, InputEditedType.exactIn);
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
      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        getPriceOfNativeTokenFromAssetToken(value, InputEditedType.exactOut);
      } else if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        getPriceOfAssetTokenFromNativeToken(value, InputEditedType.exactOut);
        if (tokenBalances?.balance) {
          setWalletHasEnoughNativeToken(value <= tokenBalances?.balance - parseFloat(swapGasFee) / 1000);
        }
      } else {
        getPriceOfAssetTokenAFromAssetTokenB(value);
      }
    }
  };

  const getSwapButtonProperties = useMemo(() => {
    if (tokenBalances?.assets) {
      if (!selectedTokens.tokenA || !selectedTokens.tokenB) {
        return { label: t("button.selectToken"), disabled: true };
      }
      if (selectedTokenAValue?.tokenValue <= 0 || selectedTokenBValue?.tokenValue <= 0) {
        return { label: t("button.enterAmount"), disabled: true };
      }
      if (
        selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol &&
        selectedTokenAValue.tokenValue > Number(tokenBalances?.balance)
      ) {
        return {
          label: t("button.insufficientTokenAmount", { token: nativeTokenSymbol }),
          disabled: true,
        };
      }
      if (
        selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol &&
        selectedTokenAValue.tokenValue < Number(tokenBalances?.balance)
      ) {
        return { label: t("button.swap"), disabled: false };
      }
      if (
        selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol &&
        selectedTokenBValue.tokenValue > parseFloat(nativeTokensInPool)
      ) {
        return {
          label: t("button.insufficientTokenLiquidity", { token: selectedTokens.tokenB.tokenSymbol }),
          disabled: true,
        };
      }
      if (
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
        selectedTokenBValue.tokenValue > parseFloat(assetTokensInPool)
      ) {
        return {
          label: t("button.insufficientTokenLiquidity", { token: selectedTokens.tokenB.tokenSymbol }),
          disabled: true,
        };
      }
      if (
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
        selectedTokenAValue.tokenValue > 0 &&
        selectedTokenBValue.tokenValue > 0
      ) {
        return { label: t("button.swap"), disabled: false };
      }
      if (selectedTokenAValue.tokenValue > 0 && selectedTokenBValue.tokenValue > 0) {
        return { label: t("button.swap"), disabled: false };
      }
    } else {
      return { label: t("button.connectWallet"), disabled: true };
    }

    return { label: "", disabled: true };
  }, [
    selectedAccount?.address,
    tokenBalances?.balance,
    selectedTokens.tokenA.decimals,
    selectedTokens.tokenB.decimals,
    selectedTokenAValue.tokenValue,
    selectedTokenBValue.tokenValue,
    walletHasEnoughNativeToken,
  ]);

  const getSwapTokenA = async () => {
    if (api) {
      const poolsAssetTokenIds = pools?.map((pool: any) => {
        if (pool?.[0]?.[1].interior?.X2) {
          const assetTokenIds = pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "").toString();
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
              pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "")
            );

            if (poolReserve?.length > 0) {
              const assetTokenMetadata: any = await api.query.assets.metadata(
                pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "")
              );

              poolTokenPairsArray.push({
                name: `${nativeTokenSymbol}–${assetTokenMetadata.toHuman().symbol}`,
              });
            }
          }
        })
      );

      const assetTokensInPoolTokenPairsArray = poolTokenPairsArray.map((item: any) => item.name.split("–")[1]);

      assetTokensInPoolTokenPairsArray.push(nativeTokenSymbol);

      // todo: refactor to be sure what data we are passing - remove any
      const assetTokensNotInPoolTokenPairsArray: any = assetTokens.filter((item: any) =>
        assetTokensInPoolTokenPairsArray.includes(item.assetTokenMetadata.symbol)
      );

      setAvailablePoolTokenA(assetTokensNotInPoolTokenPairsArray);
    }
  };

  const handleSwap = async () => {
    setSwapSuccessfulReset(false);
    if (api) {
      const tokenA = formatInputTokenValue(tokenAValueForSwap.tokenValue, selectedTokens.tokenA.decimals);
      const tokenB = formatInputTokenValue(tokenBValueForSwap.tokenValue, selectedTokens.tokenB.decimals);
      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        if (selectedTokens.tokenB.tokenId) {
          if (inputEdited.inputType === InputEditedType.exactIn) {
            await swapNativeForAssetExactIn(
              api,
              selectedTokens.tokenB.tokenId,
              selectedAccount,
              tokenA,
              tokenB,
              selectedTokens.tokenA.decimals,
              selectedTokens.tokenB.decimals,
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
                selectedTokens.tokenA.decimals,
                selectedTokens.tokenB.decimals,
                false,
                dispatch
              );
            }
          }
        }
      } else if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        if (selectedTokens.tokenA.tokenId) {
          if (inputEdited.inputType === InputEditedType.exactIn) {
            await swapNativeForAssetExactIn(
              api,
              selectedTokens.tokenA.tokenId,
              selectedAccount,
              tokenB,
              tokenA,
              selectedTokens.tokenA.decimals,
              selectedTokens.tokenB.decimals,
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
              selectedTokens.tokenA.decimals,
              selectedTokens.tokenB.decimals,
              true,
              dispatch
            );
          }
        }
      } else if (
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol
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
              selectedTokens.tokenA.decimals,
              selectedTokens.tokenB.decimals,
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
              selectedTokens.tokenA.decimals,
              selectedTokens.tokenB.decimals,
              dispatch
            );
          }
        }
      }
    }
  };

  const getSwapTokenB = () => {
    const poolLiquidTokens: any = [nativeToken]
      .concat(poolsTokenMetadata)
      ?.filter(
        (item: any) =>
          item.tokenId !== selectedTokens.tokenA?.tokenId && item.tokenId !== selectedTokens.tokenB?.tokenId
      );

    setAvailablePoolTokenB(poolLiquidTokens);

    return poolLiquidTokens;
  };

  const fillTokenPairsAndOpenModal = (tokenInputSelected: TokenSelection) => {
    if (tokenInputSelected === "tokenA") getSwapTokenA();
    if (tokenInputSelected === "tokenB") getSwapTokenB();

    setTokenSelectionModal(tokenInputSelected);
  };

  const closeSuccessModal = async () => {
    dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: false });
    setSwapSuccessfulReset(true);
    if (api) {
      const assets: any = await getWalletTokensBalance(api, selectedAccount.address);
      dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: assets });
    }
  };

  const onSwapSelectModal = (tokenData: any) => {
    setSelectedTokens((prev) => {
      return {
        ...prev,
        [tokenSelectionModal]: tokenData,
      };
    });
  };

  const checkIfEnoughTokensInPool = () => {
    if (selectedTokens && poolsCards) {
      if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        if (poolsCards) {
          const poolNative = poolsCards.find((pool) => pool.assetTokenId === selectedTokens.tokenA.tokenId);
          if (poolNative) setNativeTokensInPool(poolNative?.totalTokensLocked.nativeToken);
        }
      }
      if (selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol) {
        if (poolsCards) {
          const poolAsset = poolsCards.find((pool) => pool.assetTokenId === selectedTokens.tokenB.tokenId);
          if (poolAsset) setAssetTokensInPool(poolAsset?.totalTokensLocked.assetToken);
        }
      }
    }
  };

  const checkIsEnoughNativeTokenInPool = () => {
    if (selectedTokens && poolsCards) {
      if (
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol
      ) {
        if (poolsCards) {
          const poolAssetTokenB = poolsCards.find((pool) => pool.assetTokenId === selectedTokens.tokenB.tokenId);
          const poolAssetTokenA = poolsCards.find((pool) => pool.assetTokenId === selectedTokens.tokenA.tokenId);

          if (poolAssetTokenB && poolAssetTokenA) {
            if (
              parseFloat(poolAssetTokenB?.totalTokensLocked.nativeToken) < 1 ||
              parseFloat(poolAssetTokenA?.totalTokensLocked.nativeToken) < 1
            ) {
              setLiquidityLow(true);
            } else {
              setLiquidityLow(false);
            }
          }
        }
      } else {
        setLiquidityLow(false);
      }
    }
  };

  useEffect(() => {
    if (tokenSelected.tokenSelected === TokenPosition.tokenA && selectedTokenBValue.tokenValue > 0) {
      tokenBValue(selectedTokenBValue.tokenValue);
    }

    if (tokenSelected.tokenSelected === TokenPosition.tokenB && selectedTokenAValue.tokenValue > 0) {
      tokenAValue(selectedTokenAValue.tokenValue);
    }
  }, [selectedTokens]);

  useEffect(() => {
    if (inputEdited.inputType === InputEditedType.exactIn && selectedTokenBValue.tokenValue > 0) {
      tokenAValue(selectedTokenAValue.tokenValue);
    } else if (inputEdited.inputType === InputEditedType.exactOut && selectedTokenAValue.tokenValue > 0) {
      tokenBValue(selectedTokenBValue.tokenValue);
    }
  }, [slippageValue]);

  useEffect(() => {
    if (
      selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol ||
      selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol
    ) {
      handleSwapNativeForAssetGasFee();
    }
    if (
      selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
      selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
      selectedTokens.tokenA.tokenSymbol !== "" &&
      selectedTokens.tokenB.tokenSymbol !== ""
    ) {
      handleSwapAssetForAssetGasFee();
    }
  }, [
    selectedTokens.tokenA.tokenSymbol && selectedTokens.tokenB.tokenSymbol,
    tokenAValueForSwap.tokenValue && tokenBValueForSwap.tokenValue,
  ]);

  useEffect(() => {
    checkIfEnoughTokensInPool();
    checkIsEnoughNativeTokenInPool();
  }, [selectedTokens.tokenA.tokenSymbol, selectedTokens.tokenB.tokenSymbol]);

  useEffect(() => {
    if (swapSuccessfulReset) {
      setSelectedTokenAValue({ tokenValue: 0 });
      setSelectedTokenBValue({ tokenValue: 0 });
    }
  }, [swapSuccessfulReset]);

  return (
    <div className="flex max-w-[460px] flex-col gap-4">
      <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
        <h3 className="heading-6 font-unbounded-variable font-normal">{t("swapPage.swap")}</h3>
        <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
        <TokenAmountInput
          tokenText={selectedTokens.tokenA?.tokenSymbol}
          labelText={t("tokenAmountInput.youPay")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenAValue.tokenValue}
          onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenA)}
          onSetTokenValue={(value) => tokenAValue(value)}
          disabled={!selectedAccount || swapLoading || !tokenBalances?.assets}
          assetLoading={assetLoading}
        />
        <TokenAmountInput
          tokenText={selectedTokens.tokenB?.tokenSymbol}
          labelText={t("tokenAmountInput.youReceive")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenBValue.tokenValue}
          onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenB)}
          onSetTokenValue={(value) => tokenBValue(value)}
          disabled={!selectedAccount || swapLoading || !tokenBalances?.assets}
          assetLoading={assetLoading}
        />

        <div className="mt-1 text-small">{swapGasFeesMessage}</div>

        <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
          <div className="flex w-full flex-row justify-between text-medium font-normal text-gray-200">
            <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
            <span>{slippageValue}%</span>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex w-full basis-8/12 flex-row rounded-xl bg-white p-1 text-large font-normal text-gray-400">
              <button
                className={classNames("flex basis-1/2 justify-center rounded-lg px-4 py-3", {
                  "bg-white": !slippageAuto,
                  "bg-purple-100": slippageAuto,
                })}
                onClick={() => {
                  setSlippageAuto(true);
                  setSlippageValue(15);
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
                  className="w-full rounded-lg bg-purple-100 p-2 text-large  text-gray-200 outline-none"
                  disabled={slippageAuto || swapLoading}
                />
                <span className="absolute bottom-1/3 right-2 text-medium text-gray-100">%</span>
              </div>
            </div>
          </div>
        </div>

        <SwapSelectTokenModal
          open={tokenSelectionModal === TokenSelection.TokenA}
          title={t("modal.selectToken")}
          tokensData={availablePoolTokenA}
          onClose={() => setTokenSelectionModal(TokenSelection.None)}
          onSelect={(tokenData) => {
            setTokenSelected({ tokenSelected: TokenPosition.tokenA });
            onSwapSelectModal(tokenData);
          }}
        />

        <SwapSelectTokenModal
          open={tokenSelectionModal === TokenSelection.TokenB}
          title={t("modal.selectToken")}
          tokensData={availablePoolTokenB}
          onClose={() => setTokenSelectionModal(TokenSelection.None)}
          onSelect={(tokenData) => {
            setTokenSelected({ tokenSelected: TokenPosition.tokenB });
            onSwapSelectModal(tokenData);
          }}
        />

        <Button
          onClick={() => (getSwapButtonProperties.disabled ? null : handleSwap())}
          variant={ButtonVariants.btnInteractivePink}
          disabled={getSwapButtonProperties.disabled || swapLoading}
        >
          {swapLoading ? <Lottie options={lottieOptions} height={30} width={30} /> : getSwapButtonProperties.label}
        </Button>

        <SwapAndPoolSuccessModal
          open={swapFinalized}
          onClose={closeSuccessModal}
          contentTitle={"Successfully swapped"}
          tokenA={{
            symbol: selectedTokens.tokenA.tokenSymbol,
            value: swapExactInTokenAmount,
            icon: <DotToken />,
          }}
          tokenB={{
            symbol: selectedTokens.tokenB.tokenSymbol,
            value: swapExactOutTokenAmount,
            icon: <DotToken />,
          }}
          actionLabel="Swapped"
        />
      </div>
      <WarningMessage show={liquidityLow} message={t("pageError.lowLiquidity")} />
    </div>
  );
};

export default SwapTokens;
