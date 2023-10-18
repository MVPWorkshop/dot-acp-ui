import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ReactComponent as AssetTokenIcon } from "../../../assets/img/test-token.svg";
import { ActionType, ButtonVariants, InputEditedType } from "../../../app/types/enum";
import {
  calculateSlippageReduce,
  checkIfPoolAlreadyExists,
  formatDecimalsFromToken,
  formatInputTokenValue,
} from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast";
import { addLiquidity, checkAddPoolLiquidityGasFee } from "../../../services/poolServices";
import { setTokenBalanceUpdate } from "../../../services/polkadotWalletServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import { getAssetTokenFromNativeToken, getNativeTokenFromAssetToken } from "../../../services/tokenServices";
import classNames from "classnames";
import { lottieOptions } from "../../../assets/loader";
import Lottie from "react-lottie";
import { InputEditedProps, TokenDecimalsErrorProps } from "../../../app/types";
import PoolSelectTokenModal from "../PoolSelectTokenModal";
import CreatePool from "../CreatePool";
import WarningMessage from "../../atom/WarningMessage";

type AssetTokenProps = {
  tokenSymbol: string;
  assetTokenId: string;
  decimals: string;
  assetTokenBalance: string;
};
type NativeTokenProps = {
  nativeTokenSymbol: string;
  nativeTokenDecimals: string;
};
type TokenValueProps = {
  tokenValue: string;
};

type AddPoolLiquidityProps = {
  tokenBId?: { id: string };
};

const AddPoolLiquidity = ({ tokenBId }: AddPoolLiquidityProps) => {
  const { state, dispatch } = useAppContext();

  const navigate = useNavigate();
  const params = tokenBId ? tokenBId : useParams();

  const {
    tokenBalances,
    api,
    selectedAccount,
    pools,
    transferGasFeesMessage,
    poolGasFee,
    successModalOpen,
    addLiquidityLoading,
    exactNativeTokenAddLiquidity,
    exactAssetTokenAddLiquidity,
    assetLoading,
  } = state;

  const [selectedTokenA, setSelectedTokenA] = useState<NativeTokenProps>({
    nativeTokenSymbol: "",
    nativeTokenDecimals: "",
  });
  const [selectedTokenB, setSelectedTokenB] = useState<AssetTokenProps>({
    tokenSymbol: "",
    assetTokenId: "",
    decimals: "",
    assetTokenBalance: "",
  });
  const [selectedTokenNativeValue, setSelectedTokenNativeValue] = useState<TokenValueProps>();
  const [selectedTokenAssetValue, setSelectedTokenAssetValue] = useState<TokenValueProps>();
  const [nativeTokenWithSlippage, setNativeTokenWithSlippage] = useState<TokenValueProps>({ tokenValue: "" });
  const [assetTokenWithSlippage, setAssetTokenWithSlippage] = useState<TokenValueProps>({ tokenValue: "" });
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);
  const [slippageValue, setSlippageValue] = useState<number | undefined>(15);
  const [inputEdited, setInputEdited] = useState<InputEditedProps>({ inputType: InputEditedType.exactIn });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [poolExists, setPoolExists] = useState<boolean>(false);
  const [tooManyDecimalsError, setTooManyDecimalsError] = useState<TokenDecimalsErrorProps>({
    tokenSymbol: "",
    isError: false,
    decimalsAllowed: 0,
  });

  const selectedNativeTokenNumber = Number(selectedTokenNativeValue?.tokenValue);
  const selectedAssetTokenNumber = Number(selectedTokenAssetValue?.tokenValue);

  const navigateToPools = () => {
    navigate(POOLS_PAGE);
  };

  const populateAssetToken = () => {
    pools?.forEach((pool: any) => {
      if (pool?.[0]?.[1]?.interior?.X2) {
        if (pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "").toString() === params?.id) {
          if (params?.id) {
            const tokenAlreadySelected = tokenBalances?.assets?.find((token: any) => {
              if (params?.id) {
                return token.tokenId === params?.id.toString();
              }
            });
            if (tokenAlreadySelected) {
              setSelectedTokenB({
                tokenSymbol: tokenAlreadySelected?.assetTokenMetadata?.symbol,
                assetTokenId: params?.id,
                decimals: tokenAlreadySelected?.assetTokenMetadata?.decimals,
                assetTokenBalance: tokenAlreadySelected?.tokenAsset?.balance,
              });
            }
          }
        }
      }
    });
  };

  const handlePool = async () => {
    if (api && selectedTokenNativeValue && selectedTokenAssetValue) {
      const nativeTokenValue = formatInputTokenValue(selectedNativeTokenNumber, selectedTokenA?.nativeTokenDecimals)
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      const assetTokenValue = formatInputTokenValue(selectedAssetTokenNumber, selectedTokenB.decimals)
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      try {
        await addLiquidity(
          api,
          selectedTokenB.assetTokenId,
          selectedAccount,
          nativeTokenValue,
          assetTokenValue,
          nativeTokenWithSlippage.tokenValue.toString(),
          assetTokenWithSlippage.tokenValue.toString(),
          selectedTokenA.nativeTokenDecimals,
          selectedTokenB.decimals,
          dispatch
        );
      } catch (error) {
        dotAcpToast.error(`Error: ${error}`);
      }
    }
  };

  const handleAddPoolLiquidityGasFee = async () => {
    if (api && selectedTokenNativeValue && selectedTokenAssetValue) {
      const nativeTokenValue = formatInputTokenValue(selectedNativeTokenNumber, selectedTokenA?.nativeTokenDecimals)
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      const assetTokenValue = formatInputTokenValue(selectedAssetTokenNumber, selectedTokenB.decimals)
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      await checkAddPoolLiquidityGasFee(
        api,
        selectedTokenB.assetTokenId,
        selectedAccount,
        nativeTokenValue,
        assetTokenValue,
        nativeTokenWithSlippage.tokenValue.toString(),
        assetTokenWithSlippage.tokenValue.toString(),
        dispatch
      );
    }
  };

  const closeSuccessModal = async () => {
    dispatch({ type: ActionType.SET_SUCCESS_MODAL_OPEN, payload: false });
    navigateToPools();
    if (api) {
      const walletAssets: any = await setTokenBalanceUpdate(
        api,
        selectedAccount.address,
        selectedTokenB.assetTokenId,
        tokenBalances
      );
      dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: walletAssets });
    }
  };

  const getPriceOfAssetTokenFromNativeToken = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(value, selectedTokenA?.nativeTokenDecimals);

      const assetTokenPrice = await getAssetTokenFromNativeToken(api, selectedTokenB?.assetTokenId, valueWithDecimals);

      if (assetTokenPrice && slippageValue) {
        const assetTokenNoSemicolons = assetTokenPrice.toString()?.replace(/[, ]/g, "");

        const assetTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(assetTokenNoSemicolons),
          selectedTokenB?.decimals
        );

        const tokenWithSlippage = calculateSlippageReduce(assetTokenNoDecimals, slippageValue);
        const tokenWithSlippageFormatted = formatInputTokenValue(tokenWithSlippage, selectedTokenB?.decimals);

        setSelectedTokenAssetValue({ tokenValue: assetTokenNoDecimals.toString() });
        setAssetTokenWithSlippage({ tokenValue: tokenWithSlippageFormatted });
      }
    }
  };

  const getPriceOfNativeTokenFromAssetToken = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(value, selectedTokenB?.decimals);

      const nativeTokenPrice = await getNativeTokenFromAssetToken(api, selectedTokenB?.assetTokenId, valueWithDecimals);

      if (nativeTokenPrice && slippageValue) {
        const nativeTokenNoSemicolons = nativeTokenPrice.toString()?.replace(/[, ]/g, "");

        const nativeTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(nativeTokenNoSemicolons),
          selectedTokenA?.nativeTokenDecimals
        );

        const tokenWithSlippage = calculateSlippageReduce(nativeTokenNoDecimals, slippageValue);
        const tokenWithSlippageFormatted = formatInputTokenValue(tokenWithSlippage, selectedTokenB?.decimals);

        setSelectedTokenNativeValue({ tokenValue: nativeTokenNoDecimals.toString() });
        setNativeTokenWithSlippage({ tokenValue: tokenWithSlippageFormatted });
      }
    }
  };

  const setSelectedTokenAValue = (value: string) => {
    setInputEdited({ inputType: InputEditedType.exactIn });
    if (slippageValue && value !== "") {
      if (value.includes(".")) {
        if (value.split(".")[1].length > parseInt(selectedTokenA.nativeTokenDecimals)) {
          setTooManyDecimalsError({
            tokenSymbol: selectedTokenA.nativeTokenSymbol,
            isError: true,
            decimalsAllowed: parseInt(selectedTokenA.nativeTokenDecimals),
          });
          return;
        }
      }

      setTooManyDecimalsError({
        tokenSymbol: "",
        isError: false,
        decimalsAllowed: 0,
      });

      const nativeTokenSlippageValue = calculateSlippageReduce(Number(value), slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(nativeTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenNativeValue({ tokenValue: value.toString() });
      setNativeTokenWithSlippage({ tokenValue: tokenWithSlippageFormatted });
      getPriceOfAssetTokenFromNativeToken(Number(value));
    } else {
      setSelectedTokenAssetValue({ tokenValue: "" });
    }
  };

  const setSelectedTokenBValue = (value: string) => {
    setInputEdited({ inputType: InputEditedType.exactOut });
    if (slippageValue && value !== "") {
      if (value.includes(".")) {
        if (value.split(".")[1].length > parseInt(selectedTokenB.decimals)) {
          setTooManyDecimalsError({
            tokenSymbol: selectedTokenB.tokenSymbol,
            isError: true,
            decimalsAllowed: parseInt(selectedTokenB.decimals),
          });
          return;
        }
      }

      setTooManyDecimalsError({
        tokenSymbol: "",
        isError: false,
        decimalsAllowed: 0,
      });

      const assetTokenSlippageValue = calculateSlippageReduce(Number(value), slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(assetTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenAssetValue({ tokenValue: value.toString() });
      setAssetTokenWithSlippage({ tokenValue: tokenWithSlippageFormatted });
      getPriceOfNativeTokenFromAssetToken(Number(value));
    } else {
      setSelectedTokenNativeValue({ tokenValue: "" });
    }
  };

  const getButtonProperties = useMemo(() => {
    if (tokenBalances?.assets) {
      if (selectedTokenA.nativeTokenSymbol === "" || selectedTokenB.assetTokenId === "") {
        return { label: t("button.selectToken"), disabled: true };
      }

      if (
        selectedNativeTokenNumber <= 0 ||
        selectedAssetTokenNumber <= 0 ||
        selectedTokenNativeValue?.tokenValue === "" ||
        selectedTokenAssetValue?.tokenValue === ""
      ) {
        return { label: t("button.enterAmount"), disabled: true };
      }

      if (selectedNativeTokenNumber > Number(tokenBalances?.balance)) {
        return {
          label: t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol }),
          disabled: true,
        };
      }

      if (selectedNativeTokenNumber + parseFloat(poolGasFee) / 1000 > Number(tokenBalances?.balance)) {
        return {
          label: t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol }),
          disabled: true,
        };
      }

      if (
        selectedAssetTokenNumber >
        formatDecimalsFromToken(
          parseInt(selectedTokenB.assetTokenBalance?.replace(/[, ]/g, "")),
          selectedTokenB.decimals
        )
      ) {
        return { label: t("button.insufficientTokenAmount", { token: selectedTokenB.tokenSymbol }), disabled: true };
      }

      if (selectedNativeTokenNumber > 0 && selectedAssetTokenNumber > 0 && !tooManyDecimalsError.isError) {
        return { label: t("button.deposit"), disabled: false };
      }

      if (selectedNativeTokenNumber > 0 && selectedAssetTokenNumber > 0 && tooManyDecimalsError.isError) {
        return { label: t("button.deposit"), disabled: true };
      }
    } else {
      return { label: t("button.connectWallet"), disabled: true };
    }

    return { label: t("button.enterAmount"), disabled: true };
  }, [
    selectedTokenA.nativeTokenDecimals,
    selectedTokenB.assetTokenBalance,
    selectedTokenA.nativeTokenSymbol,
    selectedTokenB.tokenSymbol,
    selectedTokenB.decimals,
    selectedTokenNativeValue?.tokenValue,
    selectedTokenAssetValue?.tokenValue,
    tooManyDecimalsError.isError,
    tokenBalances,
  ]);

  useEffect(() => {
    if (tokenBalances) {
      setSelectedTokenA({
        nativeTokenSymbol: tokenBalances.tokenSymbol,
        nativeTokenDecimals: tokenBalances.tokenDecimals,
      });
    }
  }, [tokenBalances]);

  useEffect(() => {
    if (Number(nativeTokenWithSlippage.tokenValue) > 0 && Number(assetTokenWithSlippage.tokenValue) > 0) {
      handleAddPoolLiquidityGasFee();
    }
  }, [nativeTokenWithSlippage.tokenValue, assetTokenWithSlippage.tokenValue]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
  }, []);

  useEffect(() => {
    if (params?.id) {
      populateAssetToken();
    }
  }, [params?.id]);

  useEffect(() => {
    if (
      selectedTokenNativeValue &&
      inputEdited.inputType === InputEditedType.exactIn &&
      selectedNativeTokenNumber > 0
    ) {
      setSelectedTokenAValue(selectedTokenNativeValue.tokenValue);
    } else if (
      selectedTokenAssetValue &&
      inputEdited.inputType === InputEditedType.exactOut &&
      selectedAssetTokenNumber > 0
    ) {
      setSelectedTokenBValue(selectedTokenAssetValue.tokenValue);
    }
  }, [slippageValue]);

  useEffect(() => {
    if (tokenBId?.id) {
      const checkPoolExists = checkIfPoolAlreadyExists(tokenBId.id, pools);
      setPoolExists(checkPoolExists);
    }
  }, [tokenBId?.id]);

  useEffect(() => {
    if (tokenBId?.id) {
      const checkPoolExists = checkIfPoolAlreadyExists(selectedTokenB.assetTokenId, pools);
      setPoolExists(checkPoolExists);
    }
  }, [selectedTokenB.assetTokenId]);

  useEffect(() => {
    if (Object.keys(selectedAccount).length === 0) {
      navigateToPools();
    }
  }, [selectedAccount]);

  return (
    <div className="flex max-w-[460px] flex-col gap-4">
      {tokenBId?.id && poolExists === false ? (
        <CreatePool tokenBSelected={selectedTokenB} />
      ) : (
        <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
          <button className="absolute left-[18px] top-[18px]" onClick={navigateToPools}>
            <BackArrow width={24} height={24} />
          </button>
          <h3 className="heading-6 font-unbounded-variable font-normal">{t("poolsPage.addLiquidity")}</h3>
          <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
          <TokenAmountInput
            tokenText={selectedTokenA?.nativeTokenSymbol}
            tokenIcon={<DotToken />}
            tokenValue={selectedTokenNativeValue?.tokenValue}
            onClick={() => null}
            onSetTokenValue={(value) => setSelectedTokenAValue(value)}
            selectDisabled={true}
            disabled={addLiquidityLoading}
            assetLoading={assetLoading}
          />
          <TokenAmountInput
            tokenText={selectedTokenB?.tokenSymbol}
            tokenIcon={<DotToken />}
            tokenValue={selectedTokenAssetValue?.tokenValue}
            onClick={() => setIsModalOpen(true)}
            onSetTokenValue={(value) => setSelectedTokenBValue(value)}
            selectDisabled={!tokenBId?.id}
            disabled={addLiquidityLoading}
            assetLoading={assetLoading}
          />
          <div className="mt-1 text-small">{transferGasFeesMessage}</div>

          <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
            <div className="flex w-full justify-between text-medium font-normal text-gray-200">
              <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
              <span>{slippageValue}%</span>
            </div>
            <div className="flex w-full gap-2">
              <div className="flex w-full basis-8/12 rounded-xl bg-white p-1 text-large font-normal text-gray-400">
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
                    disabled={slippageAuto || addLiquidityLoading || assetLoading || !selectedAccount.address}
                  />
                  <span className="absolute bottom-1/3 right-2 text-medium text-gray-100">%</span>
                </div>
              </div>
            </div>
            {poolExists ? (
              <div className="flex rounded-lg bg-lime-500 px-4 py-2 text-medium font-normal text-cyan-700">
                {t("poolsPage.poolExists")}
              </div>
            ) : null}
          </div>

          <Button
            onClick={() => (getButtonProperties.disabled ? null : handlePool())}
            variant={ButtonVariants.btnInteractivePink}
            disabled={getButtonProperties.disabled || addLiquidityLoading}
          >
            {addLiquidityLoading ? (
              <Lottie options={lottieOptions} height={30} width={30} />
            ) : (
              getButtonProperties.label
            )}
          </Button>

          <PoolSelectTokenModal
            onSelect={setSelectedTokenB}
            onClose={() => setIsModalOpen(false)}
            open={isModalOpen}
            title={t("button.selectToken")}
            selected={selectedTokenB}
          />

          <SwapAndPoolSuccessModal
            open={successModalOpen}
            onClose={closeSuccessModal}
            contentTitle={t("modal.addTooExistingPool.successfullyAddedLiquidity")}
            tokenA={{
              value: exactNativeTokenAddLiquidity.toString(),
              symbol: selectedTokenA.nativeTokenSymbol,
              icon: <DotToken />,
            }}
            tokenB={{
              value: exactAssetTokenAddLiquidity.toString(),
              symbol: selectedTokenB.tokenSymbol,
              icon: <AssetTokenIcon width={24} height={24} />,
            }}
            actionLabel={t("modal.added")}
          />
        </div>
      )}
      <WarningMessage
        show={tooManyDecimalsError.isError}
        message={t("pageError.tooManyDecimals", {
          token: tooManyDecimalsError.tokenSymbol,
          decimals: tooManyDecimalsError.decimalsAllowed,
        })}
      />
    </div>
  );
};

export default AddPoolLiquidity;
