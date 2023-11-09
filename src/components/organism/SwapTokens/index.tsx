import classNames from "classnames";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import useGetNetwork from "../../../app/hooks/useGetNetwork";
import { InputEditedProps, TokenDecimalsErrorProps, TokenProps } from "../../../app/types";
import { ActionType, ButtonVariants, InputEditedType, TokenPosition, TokenSelection } from "../../../app/types/enum";
import {
  calculateSlippageAdd,
  calculateSlippageReduce,
  formatDecimalsFromToken,
  formatInputTokenValue,
} from "../../../app/util/helper";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ReactComponent as AssetTokenIcon } from "../../../assets/img/test-token.svg";
import { setTokenBalanceAfterAssetsSwapUpdate, setTokenBalanceUpdate } from "../../../services/polkadotWalletServices";
import { createPoolCardsArray, getPoolReserves } from "../../../services/poolServices";
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
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import WarningMessage from "../../atom/WarningMessage";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import SwapSelectTokenModal from "../SwapSelectTokenModal";
import { LottieMedium } from "../../../assets/loader";

type SwapTokenProps = {
  tokenA: TokenProps;
  tokenB: TokenProps;
};

type TokenValueProps = {
  tokenValue: string;
};

type TokenValueSlippageProps = {
  tokenValue: number;
};

type TokenSelectedProps = {
  tokenSelected: TokenPosition;
};

const SwapTokens = () => {
  const { state, dispatch } = useAppContext();
  const { nativeTokenSymbol, assethubSubscanUrl } = useGetNetwork();

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
    isTokenCanNotCreateWarningSwap,
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
  const [selectedTokenAValue, setSelectedTokenAValue] = useState<TokenValueProps>({ tokenValue: "" });
  const [selectedTokenBValue, setSelectedTokenBValue] = useState<TokenValueProps>({ tokenValue: "" });
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
  const [lowTradingMinimum, setLowTradingMinimum] = useState<boolean>(false);
  const [lowMinimalAmountAssetToken, setLowMinimalAmountAssetToken] = useState<boolean>(false);
  const [minimumBalanceAssetToken, setMinimumBalanceAssetToken] = useState<number>(0);
  const [swapSuccessfulReset, setSwapSuccessfulReset] = useState<boolean>(false);
  const [tooManyDecimalsError, setTooManyDecimalsError] = useState<TokenDecimalsErrorProps>({
    tokenSymbol: "",
    isError: false,
    decimalsAllowed: 0,
  });

  const [isTransactionTimeout, setIsTransactionTimeout] = useState<boolean>(false);
  const [waitingForTransaction, setWaitingForTransaction] = useState<NodeJS.Timeout>();

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

  const tokenANumber = Number(selectedTokenAValue?.tokenValue);
  const tokenBNumber = Number(selectedTokenBValue?.tokenValue);

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
        assetTokenPrice === "0" ? setLowTradingMinimum(true) : setLowTradingMinimum(false);
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
          setSelectedTokenBValue({ tokenValue: assetTokenNoDecimals.toString() });
        } else if (inputType === InputEditedType.exactOut) {
          setTokenAValueForSwap({ tokenValue: assetTokenWithSlippage });
          setTokenBValueForSwap({ tokenValue: value });
          setSelectedTokenAValue({ tokenValue: assetTokenNoDecimals.toString() });
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
        nativeTokenPrice === "0" ? setLowTradingMinimum(true) : setLowTradingMinimum(false);
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
            setSelectedTokenBValue({ tokenValue: nativeTokenNoDecimals.toString() });
          } else if (inputType === InputEditedType.exactOut) {
            setTokenAValueForSwap({ tokenValue: nativeTokenWithSlippage });
            setTokenBValueForSwap({ tokenValue: value });
            setSelectedTokenAValue({ tokenValue: nativeTokenNoDecimals.toString() });
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
          assetTokenPrice === "0" ? setLowTradingMinimum(true) : setLowTradingMinimum(false);
          const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");
          const assetTokenNoDecimals = formatDecimalsFromToken(
            parseFloat(assetTokenNoSemicolons),
            selectedTokens.tokenA.decimals
          );
          const assetTokenWithSlippage = calculateSlippageAdd(assetTokenNoDecimals, slippageValue);

          setTokenAValueForSwap({ tokenValue: assetTokenWithSlippage });
          setTokenBValueForSwap({ tokenValue: value });
          setSelectedTokenAValue({ tokenValue: assetTokenNoDecimals.toString() });
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
          assetTokenPrice === "0" ? setLowTradingMinimum(true) : setLowTradingMinimum(false);
          const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");
          const assetTokenNoDecimals = formatDecimalsFromToken(
            parseFloat(assetTokenNoSemicolons),
            selectedTokens.tokenB.decimals
          );

          const assetTokenWithSlippage = calculateSlippageReduce(assetTokenNoDecimals, slippageValue);

          setTokenAValueForSwap({ tokenValue: value });
          setTokenBValueForSwap({ tokenValue: assetTokenWithSlippage });
          setSelectedTokenBValue({ tokenValue: assetTokenNoDecimals.toString() });
        }
      }
    }
  };

  const tokenAValue = async (value?: string) => {
    if (value) {
      const valueAsNumber = Number(value);

      if (value.includes(".")) {
        if (value.split(".")[1].length > parseInt(selectedTokens.tokenA.decimals)) {
          setTooManyDecimalsError({
            tokenSymbol: selectedTokens.tokenA.tokenSymbol,
            isError: true,
            decimalsAllowed: parseInt(selectedTokens.tokenA.decimals),
          });
          return;
        }
      }

      setTooManyDecimalsError({
        tokenSymbol: "",
        isError: false,
        decimalsAllowed: 0,
      });

      setSelectedTokenAValue({ tokenValue: value });
      setInputEdited({ inputType: InputEditedType.exactIn });

      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        getPriceOfAssetTokenFromNativeToken(valueAsNumber, InputEditedType.exactIn);
      } else if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        getPriceOfNativeTokenFromAssetToken(valueAsNumber, InputEditedType.exactIn);
      } else {
        getPriceOfAssetTokenBFromAssetTokenA(valueAsNumber);
      }
    } else {
      setSelectedTokenAValue({ tokenValue: "" });
      setSelectedTokenBValue({ tokenValue: "" });
    }
  };

  const tokenBValue = async (value?: string) => {
    if (value) {
      const valueAsNumber = Number(value);

      if (value.includes(".")) {
        if (value.split(".")[1].length > parseInt(selectedTokens.tokenB.decimals)) {
          setTooManyDecimalsError({
            tokenSymbol: selectedTokens.tokenB.tokenSymbol,
            isError: true,
            decimalsAllowed: parseInt(selectedTokens.tokenB.decimals),
          });
          return;
        }
      }

      setTooManyDecimalsError({
        tokenSymbol: "",
        isError: false,
        decimalsAllowed: 0,
      });

      setSelectedTokenBValue({ tokenValue: value });
      setInputEdited({ inputType: InputEditedType.exactOut });

      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        getPriceOfNativeTokenFromAssetToken(valueAsNumber, InputEditedType.exactOut);
      } else if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        getPriceOfAssetTokenFromNativeToken(valueAsNumber, InputEditedType.exactOut);
        if (tokenBalances?.balance) {
          setWalletHasEnoughNativeToken(valueAsNumber <= tokenBalances?.balance - parseFloat(swapGasFee) / 1000);
        }
      } else {
        getPriceOfAssetTokenAFromAssetTokenB(valueAsNumber);
      }
    } else {
      setSelectedTokenAValue({ tokenValue: "" });
      setSelectedTokenBValue({ tokenValue: "" });
    }
  };

  const getSwapButtonProperties = useMemo(() => {
    const tokenBalanceNumber = Number(tokenBalances?.balance);
    if (tokenBalances?.assets) {
      if (selectedTokens.tokenA.tokenSymbol === "" || selectedTokens.tokenB.tokenSymbol === "") {
        return { label: t("button.selectToken"), disabled: true };
      }
      if (
        tokenANumber <= 0 ||
        tokenBNumber <= 0 ||
        selectedTokenAValue?.tokenValue === "" ||
        selectedTokenBValue?.tokenValue === ""
      ) {
        return { label: t("button.enterAmount"), disabled: true };
      }
      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol && tokenANumber > tokenBalanceNumber) {
        return {
          label: t("button.insufficientTokenAmount", { token: nativeTokenSymbol }),
          disabled: true,
        };
      }
      if (Number(tokenBValueForSwap.tokenValue) < 1 && selectedTokens.tokenB.decimals === "0") {
        return {
          label: t("button.toLowForSwap", { token: selectedTokens.tokenB.tokenSymbol }),
          disabled: true,
        };
      }
      if (
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
        tokenANumber >
          formatDecimalsFromToken(
            Number(selectedTokens.tokenA.tokenBalance.replace(/[, ]/g, "")),
            selectedTokens.tokenA.decimals
          )
      ) {
        return {
          label: t("button.insufficientTokenAmount", { token: selectedTokens.tokenA.tokenSymbol }),
          disabled: true,
        };
      }
      if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol && tokenBNumber > Number(nativeTokensInPool)) {
        return {
          label: t("button.insufficientTokenLiquidity", { token: selectedTokens.tokenB.tokenSymbol }),
          disabled: true,
        };
      }
      if (selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol && tokenBNumber > Number(assetTokensInPool)) {
        return {
          label: t("button.insufficientTokenLiquidity", { token: selectedTokens.tokenB.tokenSymbol }),
          disabled: true,
        };
      }
      if (
        selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol &&
        tokenANumber < tokenBalanceNumber &&
        !tooManyDecimalsError.isError
      ) {
        return { label: t("button.swap"), disabled: false };
      }
      if (
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
        tokenANumber > 0 &&
        tokenBNumber > 0 &&
        !tooManyDecimalsError.isError
      ) {
        return { label: t("button.swap"), disabled: false };
      }
      if (tokenANumber > 0 && tokenBNumber > 0 && !tooManyDecimalsError.isError) {
        return { label: t("button.swap"), disabled: false };
      }
      if (tokenANumber > 0 && tokenBNumber > 0 && tooManyDecimalsError.isError) {
        return { label: t("button.swap"), disabled: true };
      }
    } else {
      return { label: t("button.connectWallet"), disabled: true };
    }

    return { label: t("button.selectToken"), disabled: true };
  }, [
    selectedAccount?.address,
    tooManyDecimalsError.isError,
    tokenBalances?.balance,
    selectedTokens.tokenA.decimals,
    selectedTokens.tokenB.decimals,
    selectedTokenAValue?.tokenValue,
    selectedTokenBValue?.tokenValue,
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
        ?.filter((item: any) => item.tokenId !== selectedTokens.tokenB?.tokenId);

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
    if (waitingForTransaction) {
      clearTimeout(waitingForTransaction);
    }
    setSwapSuccessfulReset(false);
    setIsTransactionTimeout(false);
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
      ?.filter((item: any) => item.tokenId !== selectedTokens.tokenA?.tokenId);
    if (tokenBalances !== null) {
      for (const item of poolLiquidTokens) {
        for (const walletAsset of tokenBalances.assets) {
          if (item.tokenId === walletAsset.tokenId) {
            item.tokenAsset.balance = walletAsset.tokenAsset.balance;
          }
        }
      }
      setAvailablePoolTokenB(poolLiquidTokens);
    }
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
      await createPoolCardsArray(api, dispatch, pools, selectedAccount);

      if (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol) {
        const assets: any = await setTokenBalanceUpdate(
          api,
          selectedAccount.address,
          selectedTokens.tokenB.tokenId,
          tokenBalances
        );
        dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: assets });
      }
      if (selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) {
        const assets: any = await setTokenBalanceUpdate(
          api,
          selectedAccount.address,
          selectedTokens.tokenA.tokenId,
          tokenBalances
        );
        dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: assets });
      }
      if (
        selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
        selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol
      ) {
        const assets: any = await setTokenBalanceAfterAssetsSwapUpdate(
          api,
          selectedAccount.address,
          selectedTokens.tokenA.tokenId,
          selectedTokens.tokenB.tokenId,
          tokenBalances
        );
        dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: assets });
      }
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

  const checkAssetTokenMinAmountToSwap = async () => {
    const token = tokenBalances?.assets?.filter((item: any) => selectedTokens.tokenB.tokenId === item.tokenId);
    if (token?.length === 0) {
      if (selectedTokenBValue.tokenValue && api) {
        const assetTokenInfo: any = await api.query.assets.asset(selectedTokens.tokenB.tokenId);
        const assetTokenMinBalance = assetTokenInfo.toHuman()?.minBalance;
        if (
          parseInt(formatInputTokenValue(tokenBValueForSwap.tokenValue, selectedTokens.tokenB.decimals)) <
          parseInt(assetTokenMinBalance?.replace(/[, ]/g, ""))
        ) {
          setMinimumBalanceAssetToken(
            formatDecimalsFromToken(assetTokenMinBalance?.replace(/[, ]/g, ""), selectedTokens.tokenB.decimals)
          );
          setLowMinimalAmountAssetToken(true);
        } else {
          setLowMinimalAmountAssetToken(false);
        }
      }
    }
  };

  useEffect(() => {
    if (
      selectedTokenBValue?.tokenValue &&
      tokenSelected.tokenSelected === TokenPosition.tokenA &&
      parseFloat(selectedTokenBValue?.tokenValue) > 0
    ) {
      tokenBValue(selectedTokenBValue.tokenValue);
    }

    if (selectedTokenAValue?.tokenValue && tokenSelected.tokenSelected === TokenPosition.tokenB && tokenANumber > 0) {
      tokenAValue(selectedTokenAValue.tokenValue);
    }
  }, [selectedTokens]);

  useEffect(() => {
    if (
      selectedTokenAValue?.tokenValue &&
      selectedTokenBValue?.tokenValue &&
      inputEdited.inputType === InputEditedType.exactIn &&
      parseFloat(selectedTokenBValue.tokenValue) > 0
    ) {
      tokenAValue(selectedTokenAValue?.tokenValue);
    } else if (
      selectedTokenAValue?.tokenValue &&
      selectedTokenBValue?.tokenValue &&
      inputEdited.inputType === InputEditedType.exactOut &&
      parseFloat(selectedTokenAValue.tokenValue) > 0
    ) {
      tokenBValue(selectedTokenBValue?.tokenValue);
    }
  }, [slippageValue]);

  useEffect(() => {
    if (
      (selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol ||
        selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol) &&
      selectedTokenAValue.tokenValue !== "" &&
      selectedTokenBValue.tokenValue !== ""
    ) {
      handleSwapNativeForAssetGasFee();
    }
    if (
      selectedTokens.tokenA.tokenSymbol !== nativeTokenSymbol &&
      selectedTokens.tokenB.tokenSymbol !== nativeTokenSymbol &&
      selectedTokens.tokenA.tokenSymbol !== "" &&
      selectedTokens.tokenB.tokenSymbol !== "" &&
      selectedTokenAValue.tokenValue !== "" &&
      selectedTokenBValue.tokenValue !== ""
    ) {
      handleSwapAssetForAssetGasFee();
    }
    checkAssetTokenMinAmountToSwap();
    dispatch({ type: ActionType.SET_TOKEN_CAN_NOT_CREATE_WARNING_SWAP, payload: false });
  }, [
    selectedTokens.tokenA.tokenSymbol && selectedTokens.tokenB.tokenSymbol,
    tokenAValueForSwap.tokenValue && tokenBValueForSwap.tokenValue,
  ]);
  useEffect(() => {
    if (selectedTokenBValue.tokenValue === "") {
      setTokenAValueForSwap({ tokenValue: 0 });
      setTokenBValueForSwap({ tokenValue: 0 });
      setLowMinimalAmountAssetToken(false);
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
        payload: "",
      });
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEE,
        payload: "",
      });
    }
  }, [
    selectedTokenAValue.tokenValue,
    selectedTokenBValue.tokenValue,
    selectedTokens.tokenA.tokenSymbol,
    selectedTokens.tokenB.tokenSymbol,
  ]);

  useEffect(() => {
    checkIfEnoughTokensInPool();
    checkIsEnoughNativeTokenInPool();
  }, [selectedTokens.tokenA.tokenSymbol, selectedTokens.tokenB.tokenSymbol]);

  useEffect(() => {
    if (swapSuccessfulReset) {
      setSelectedTokenAValue({ tokenValue: "" });
      setSelectedTokenBValue({ tokenValue: "" });
    }
  }, [swapSuccessfulReset]);

  useEffect(() => {
    if (Object.keys(selectedAccount).length === 0) {
      setSelectedTokenAValue({ tokenValue: "" });
      setSelectedTokenBValue({ tokenValue: "" });
      setSelectedTokens({
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
    }
  }, [selectedAccount]);

  useEffect(() => {
    dispatch({
      type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
      payload: "",
    });
    dispatch({
      type: ActionType.SET_SWAP_GAS_FEE,
      payload: "",
    });
  }, []);

  useEffect(() => {
    if (swapLoading) {
      setWaitingForTransaction(
        setTimeout(() => {
          if (swapLoading) {
            setIsTransactionTimeout(true);
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          }
        }, 180000)
      ); // 3 minutes 180000
    } else {
      if (waitingForTransaction) {
        clearTimeout(waitingForTransaction);
      }
    }
  }, [swapLoading]);

  return (
    <div className="flex max-w-[460px] flex-col gap-4">
      <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
        <h3 className="heading-6 font-unbounded-variable font-normal">{t("swapPage.swap")}</h3>
        <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
        <TokenAmountInput
          tokenText={selectedTokens.tokenA?.tokenSymbol}
          tokenBalance={selectedTokens.tokenA?.tokenBalance}
          tokenId={selectedTokens.tokenA?.tokenId}
          tokenDecimals={selectedTokens.tokenA?.decimals}
          labelText={t("tokenAmountInput.youPay")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenAValue?.tokenValue}
          onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenA)}
          onSetTokenValue={(value) => tokenAValue(value.toString())}
          disabled={!selectedAccount || swapLoading || !tokenBalances?.assets || poolsTokenMetadata.length === 0}
          assetLoading={assetLoading}
        />

        <TokenAmountInput
          tokenText={selectedTokens.tokenB?.tokenSymbol}
          tokenBalance={selectedTokens.tokenB?.tokenBalance}
          tokenId={selectedTokens.tokenB?.tokenId}
          tokenDecimals={selectedTokens.tokenB?.decimals}
          labelText={t("tokenAmountInput.youReceive")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenBValue?.tokenValue}
          onClick={() => fillTokenPairsAndOpenModal(TokenSelection.TokenB)}
          onSetTokenValue={(value) => tokenBValue(value.toString())}
          disabled={!selectedAccount || swapLoading || !tokenBalances?.assets || poolsTokenMetadata.length === 0}
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
                disabled={assetLoading || !selectedAccount.address}
              >
                {t("tokenAmountInput.auto")}
              </button>

              <button
                className={classNames("flex basis-1/2 justify-center rounded-lg px-4 py-3", {
                  "bg-white": slippageAuto,
                  "bg-purple-100": !slippageAuto,
                })}
                onClick={() => setSlippageAuto(false)}
                disabled={assetLoading || !selectedAccount.address}
              >
                {t("tokenAmountInput.custom")}
              </button>
            </div>
            <div className="flex basis-1/3">
              <div className="relative flex">
                <NumericFormat
                  value={slippageValue}
                  isAllowed={(values) => {
                    const { formattedValue, floatValue } = values;
                    return formattedValue === "" || (floatValue !== undefined && floatValue <= 99);
                  }}
                  onValueChange={({ value }) => {
                    setSlippageValue(parseInt(value) >= 0 ? parseInt(value) : 0);
                  }}
                  fixedDecimalScale={true}
                  thousandSeparator={false}
                  allowNegative={false}
                  className="w-full rounded-lg bg-purple-100 p-2 text-large  text-gray-200 outline-none"
                  disabled={slippageAuto || swapLoading || assetLoading || !selectedAccount.address}
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
          selected={selectedTokens.tokenA}
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
          selected={selectedTokens.tokenB}
        />

        <Button
          onClick={() => (getSwapButtonProperties.disabled ? null : handleSwap())}
          variant={ButtonVariants.btnInteractivePink}
          disabled={getSwapButtonProperties.disabled || swapLoading}
        >
          {swapLoading ? <LottieMedium /> : getSwapButtonProperties.label}
        </Button>

        <SwapAndPoolSuccessModal
          open={swapFinalized}
          onClose={closeSuccessModal}
          contentTitle={"Successfully swapped"}
          tokenA={{
            symbol: selectedTokens.tokenA.tokenSymbol,
            value: swapExactInTokenAmount.toString(),
            icon:
              selectedTokens.tokenA.tokenSymbol === nativeTokenSymbol ? (
                <DotToken />
              ) : (
                <AssetTokenIcon width={24} height={24} />
              ),
          }}
          tokenB={{
            symbol: selectedTokens.tokenB.tokenSymbol,
            value: swapExactOutTokenAmount.toString(),
            icon:
              selectedTokens.tokenB.tokenSymbol === nativeTokenSymbol ? (
                <DotToken />
              ) : (
                <AssetTokenIcon width={24} height={24} />
              ),
          }}
          actionLabel="Swapped"
        />
      </div>
      <WarningMessage show={lowTradingMinimum} message={t("pageError.tradingMinimum")} />
      <WarningMessage
        show={lowMinimalAmountAssetToken}
        message={t("pageError.lowMinimalAmountAssetToken", {
          tokenSymbol: selectedTokens.tokenB.tokenSymbol,
          minimalAmount: minimumBalanceAssetToken,
        })}
      />
      <WarningMessage
        show={tooManyDecimalsError.isError}
        message={t("pageError.tooManyDecimals", {
          token: tooManyDecimalsError.tokenSymbol,
          decimals: tooManyDecimalsError.decimalsAllowed,
        })}
      />
      <WarningMessage show={liquidityLow} message={t("pageError.lowLiquidity")} />
      <WarningMessage show={isTokenCanNotCreateWarningSwap} message={t("pageError.tokenCanNotCreateWarning")} />
      <WarningMessage
        show={isTransactionTimeout}
        message={t("pageError.transactionTimeout", { url: `${assethubSubscanUrl}${selectedAccount.address}` })}
      />
    </div>
  );
};

export default SwapTokens;
