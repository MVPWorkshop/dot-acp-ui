import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType, ButtonVariants, InputEditedType } from "../../../app/types/enum";
import {
  calculateSlippageReduce,
  checkIfPoolAlreadyExists,
  formatDecimalsFromToken,
  formatInputTokenValue,
} from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast";
import { addLiquidity, checkAddPoolLiquidityGasFee, getAllPools } from "../../../services/poolServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import { getAssetTokenFromNativeToken, getNativeTokenFromAssetToken } from "../../../services/tokenServices";
import classNames from "classnames";
import { lottieOptions } from "../../../assets/loader";
import Lottie from "react-lottie";
import { InputEditedProps } from "../../../app/types";
import PoolSelectTokenModal from "../PoolSelectTokenModal";
import CreatePool from "../CreatePool";

type AssetTokenProps = {
  tokenSymbol: string;
  assetTokenId: string;
  decimals: string;
  assetTokenBalance: string;
};
type NativeTokenProps = {
  nativeTokenSymbol: any; //to do
  nativeTokenDecimals: any; //to do
};
type TokenValueProps = {
  tokenValue: number;
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
  const [selectedTokenNativeValue, setSelectedTokenNativeValue] = useState<TokenValueProps>({ tokenValue: 0 });
  const [selectedTokenAssetValue, setSelectedTokenAssetValue] = useState<TokenValueProps>({ tokenValue: 0 });
  const [nativeTokenWithSlippage, setNativeTokenWithSlippage] = useState<TokenValueProps>({ tokenValue: 0 });
  const [assetTokenWithSlippage, setAssetTokenWithSlippage] = useState<TokenValueProps>({ tokenValue: 0 });
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);
  const [slippageValue, setSlippageValue] = useState<number | undefined>(15);
  const [inputEdited, setInputEdited] = useState<InputEditedProps>({ inputType: InputEditedType.exactIn });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [poolExists, setPoolExists] = useState<boolean>(false);

  const nativeTokenValue = formatInputTokenValue(
    selectedTokenNativeValue.tokenValue,
    selectedTokenA?.nativeTokenDecimals
  )
    .toLocaleString()
    ?.replace(/[, ]/g, "");
  const assetTokenValue = formatInputTokenValue(selectedTokenAssetValue.tokenValue, selectedTokenB.decimals)
    .toLocaleString()
    ?.replace(/[, ]/g, "");

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
    try {
      if (api) {
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
      }
    } catch (error) {
      dotAcpToast.error(`Error: ${error}`);
    }
  };

  const handleAddPoolLiquidityGasFee = async () => {
    if (api)
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
  };

  const closeSuccessModal = async () => {
    dispatch({ type: ActionType.SET_SUCCESS_MODAL_OPEN, payload: false });
    if (api) await getAllPools(api);
    navigateToPools();
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

        setSelectedTokenAssetValue({ tokenValue: assetTokenNoDecimals });
        setAssetTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
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

        setSelectedTokenNativeValue({ tokenValue: nativeTokenNoDecimals });
        setNativeTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      }
    }
  };

  const setSelectedTokenAValue = (value: number) => {
    setInputEdited({ inputType: InputEditedType.exactIn });
    if (selectedTokenNativeValue && slippageValue) {
      const nativeTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(nativeTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenNativeValue({ tokenValue: value });
      setNativeTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      getPriceOfAssetTokenFromNativeToken(value);
    }
  };

  const setSelectedTokenBValue = (value: number) => {
    setInputEdited({ inputType: InputEditedType.exactOut });
    if (selectedTokenAssetValue && slippageValue) {
      const assetTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(assetTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenAssetValue({ tokenValue: value });
      setAssetTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      getPriceOfNativeTokenFromAssetToken(value);
    }
  };

  const getButtonProperties = useMemo(() => {
    if (tokenBalances?.assets) {
      if (!selectedTokenA.nativeTokenSymbol || !selectedTokenB.assetTokenId) {
        return { label: t("button.selectToken"), disabled: true };
      }

      if (selectedTokenNativeValue?.tokenValue <= 0 || selectedTokenAssetValue?.tokenValue <= 0) {
        return { label: t("button.enterAmount"), disabled: true };
      }

      if (selectedTokenNativeValue?.tokenValue > Number(tokenBalances?.balance)) {
        return {
          label: t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol }),
          disabled: true,
        };
      }

      if (selectedTokenNativeValue?.tokenValue + parseFloat(poolGasFee) / 1000 > Number(tokenBalances?.balance)) {
        return {
          label: t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol }),
          disabled: true,
        };
      }

      if (
        selectedTokenAssetValue?.tokenValue >
        formatDecimalsFromToken(
          parseInt(selectedTokenB.assetTokenBalance?.replace(/[, ]/g, "")),
          selectedTokenB.decimals
        )
      ) {
        return { label: t("button.insufficientTokenAmount", { token: selectedTokenB.tokenSymbol }), disabled: true };
      }

      if (selectedTokenA && selectedTokenB) {
        return { label: t("button.deposit"), disabled: false };
      }
    } else {
      return { label: t("button.connectWallet"), disabled: true };
    }

    return { label: "", disabled: true };
  }, [
    selectedTokenA.nativeTokenDecimals,
    selectedTokenB.assetTokenBalance,
    selectedTokenA.nativeTokenSymbol,
    selectedTokenB.tokenSymbol,
    selectedTokenB.decimals,
    selectedTokenNativeValue.tokenValue,
    selectedTokenAssetValue.tokenValue,
    tokenBalances,
  ]);

  useEffect(() => {
    if (tokenBalances) {
      setSelectedTokenA({
        nativeTokenSymbol: tokenBalances?.tokenSymbol as NativeTokenProps,
        nativeTokenDecimals: tokenBalances?.tokenDecimals as NativeTokenProps,
      });
    }
  }, [tokenBalances]);

  useEffect(() => {
    if (nativeTokenWithSlippage.tokenValue > 0 && assetTokenWithSlippage.tokenValue > 0) {
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
    if (inputEdited.inputType === InputEditedType.exactIn && selectedTokenNativeValue.tokenValue > 0) {
      setSelectedTokenAValue(selectedTokenNativeValue.tokenValue);
    } else if (inputEdited.inputType === InputEditedType.exactOut && selectedTokenAssetValue.tokenValue > 0) {
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

  return (
    <>
      {tokenBId?.id && poolExists === false ? (
        <CreatePool tokenBSelected={selectedTokenB} />
      ) : (
        <div className="relative flex w-full max-w-[460px] flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
          <button className="absolute left-[18px] top-[18px]" onClick={navigateToPools}>
            <BackArrow width={24} height={24} />
          </button>
          <h3 className="heading-6 font-unbounded-variable font-normal">{t("poolsPage.addLiquidity")}</h3>
          <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
          <TokenAmountInput
            tokenText={selectedTokenA?.nativeTokenSymbol}
            labelText={t("tokenAmountInput.youPay")}
            tokenIcon={<DotToken />}
            tokenValue={selectedTokenNativeValue?.tokenValue}
            onClick={() => null}
            onSetTokenValue={(value) => setSelectedTokenAValue(value)}
            selectDisabled={true}
            disabled={addLiquidityLoading}
          />
          <TokenAmountInput
            tokenText={selectedTokenB?.tokenSymbol}
            labelText={t("tokenAmountInput.youPay")}
            tokenIcon={<DotToken />}
            tokenValue={selectedTokenAssetValue?.tokenValue}
            onClick={() => setIsModalOpen(true)}
            onSetTokenValue={(value) => setSelectedTokenBValue(value)}
            selectDisabled={!tokenBId?.id}
            disabled={addLiquidityLoading}
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
                    onValueChange={({ floatValue }) => setSlippageValue(floatValue)}
                    fixedDecimalScale={true}
                    thousandSeparator={false}
                    allowNegative={false}
                    className="w-full rounded-lg bg-purple-100 p-2 text-large  text-gray-200 outline-none"
                    placeholder="15"
                    disabled={slippageAuto || addLiquidityLoading}
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
          />

          <SwapAndPoolSuccessModal
            open={successModalOpen}
            onClose={closeSuccessModal}
            contentTitle={t("modal.addTooExistingPool.successfullyAddedLiquidity")}
            tokenA={{
              value: exactNativeTokenAddLiquidity,
              symbol: selectedTokenA.nativeTokenSymbol,
              icon: <DotToken />,
            }}
            tokenB={{
              value: exactAssetTokenAddLiquidity,
              symbol: selectedTokenB.tokenSymbol,
              icon: <DotToken />,
            }}
            actionLabel={t("modal.added")}
          />
        </div>
      )}
    </>
  );
};

export default AddPoolLiquidity;
