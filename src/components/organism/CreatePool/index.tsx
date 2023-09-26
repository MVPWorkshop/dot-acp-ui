import { t } from "i18next";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType, ButtonVariants, SwapAndPoolStatus } from "../../../app/types/enum";
import { calculateSlippageReduce, formatDecimalsFromToken, formatInputTokenValue } from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast";
import { checkCreatePoolGasFee, createPool, getAllPools } from "../../../services/poolServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import PoolSelectTokenModal from "../PoolSelectTokenModal";
import classNames from "classnames";
import WarningMessage from "../../atom/WarningMessage";

type AssetTokenProps = {
  tokenSymbol: string;
  assetTokenId: string;
  decimals: string;
  assetTokenBalance: string;
};
type NativeTokenProps = {
  nativeTokenSymbol: any;
  nativeTokenDecimals: any;
};
type TokenValueProps = {
  tokenValue: number;
};

const CreatePool = () => {
  const { state, dispatch } = useAppContext();

  const navigate = useNavigate();

  const { tokenBalances, api, selectedAccount, pools, transferGasFeesMessage, poolGasFee, successModalOpen } = state;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
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
  const [poolExists, setPoolExists] = useState<boolean>(false);
  const [assetTokenMinValueExceeded, setAssetTokenMinValueExceeded] = useState<boolean>(false);
  const [assetTokenMinValue, setAssetTokenMinValue] = useState<string>("");

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

  const checkIfPoolAlreadyExists = (id: string) => {
    let exists = false;

    if (id) {
      exists = !!pools.find((pool: any) => {
        return (
          pool?.[0]?.[1]?.interior?.X2 &&
          pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "").toString() === id
        );
      });
    }

    setPoolExists(exists);
  };

  const handlePool = async () => {
    try {
      if (api) {
        await createPool(
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
    } catch (error) {
      dotAcpToast.error(`Error: ${error}`);
    }
  };

  const handlePoolGasFee = async () => {
    if (api) await checkCreatePoolGasFee(api, selectedTokenB.assetTokenId, selectedAccount, dispatch);
  };

  const closeSuccessModal = async () => {
    setIsSuccessModalOpen(false);
    dispatch({ type: ActionType.SET_SUCCESS_MODAL_OPEN, payload: false });
    if (api) await getAllPools(api);
    navigateToPools();
  };

  const setSelectedTokenAValue = (value: number) => {
    if (selectedTokenNativeValue && slippageValue) {
      const nativeTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(nativeTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenNativeValue({ tokenValue: value });
      setNativeTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
    }
  };

  const setSelectedTokenBValue = (value: number) => {
    if (selectedTokenAssetValue && slippageValue) {
      const assetTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(assetTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenAssetValue({ tokenValue: value });
      setAssetTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
    }
  };

  const checkAssetTokenMinAmount = async () => {
    if (selectedTokenAssetValue && api && selectedTokenB.assetTokenId) {
      const assetTokenInfo: any = await api.query.assets.asset(selectedTokenB.assetTokenId);
      const assetTokenMinBalance = assetTokenInfo.toHuman()?.minBalance;
      if (selectedTokenAssetValue.tokenValue >= assetTokenMinBalance?.replace(/[, ]/g, "")) {
        setAssetTokenMinValueExceeded(false);
      } else {
        setAssetTokenMinValue(assetTokenMinBalance);
        setAssetTokenMinValueExceeded(true);
      }
    }
  };

  const returnButtonStatus = () => {
    if (!selectedTokenA.nativeTokenSymbol || !selectedTokenB.assetTokenId) {
      return t("button.selectToken");
    }
    if (selectedTokenNativeValue?.tokenValue <= 0 || selectedTokenAssetValue?.tokenValue <= 0) {
      return t("button.enterAmount");
    }
    if (selectedTokenNativeValue?.tokenValue > Number(tokenBalances?.balance)) {
      return t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol });
    }
    if (selectedTokenNativeValue?.tokenValue + parseFloat(poolGasFee) / 1000 > Number(tokenBalances?.balance)) {
      return t("button.insufficientTokenAmount", { token: selectedTokenA.nativeTokenSymbol });
    }
    if (
      selectedTokenAssetValue?.tokenValue >
      formatDecimalsFromToken(parseInt(selectedTokenB.assetTokenBalance?.replace(/[, ]/g, "")), selectedTokenB.decimals)
    ) {
      return t("button.insufficientTokenAmount", { token: selectedTokenB.tokenSymbol });
    }
    if (selectedTokenA && selectedTokenB && poolExists) {
      return t("button.enterAmount");
    }
    if (selectedTokenA && selectedTokenB) {
      return assetTokenMinValueExceeded ? t("button.minimumTokenAmountExceeded") : t("button.deposit");
    }
  };

  useEffect(() => {
    if (tokenBalances) {
      setSelectedTokenA({
        nativeTokenSymbol: tokenBalances?.tokenSymbol as NativeTokenProps,
        nativeTokenDecimals: tokenBalances?.tokenDecimals as NativeTokenProps,
      });
    }
  }, [tokenBalances]);

  useEffect(() => {
    checkIfPoolAlreadyExists(selectedTokenB.assetTokenId);
  }, [selectedTokenB.assetTokenId]);

  useEffect(() => {
    if (!poolExists && selectedTokenB.assetTokenId) {
      handlePoolGasFee();
    }
  }, [poolExists, selectedTokenB.assetTokenId]);

  useEffect(() => {
    if (successModalOpen) setIsSuccessModalOpen(true);
  }, [successModalOpen]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
  }, []);

  useEffect(() => {
    checkAssetTokenMinAmount();
  }, [selectedTokenAssetValue.tokenValue]);

  return (
    <div className="flex max-w-[460px] flex-col gap-4">
      <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
        <button className="absolute left-[18px] top-[18px]" onClick={navigateToPools}>
          <BackArrow width={24} height={24} />
        </button>
        <h3 className="heading-6 font-unbounded-variable font-normal">{t("poolsPage.newPosition")}</h3>
        <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
        <TokenAmountInput
          tokenText={selectedTokenA?.nativeTokenSymbol}
          labelText={t("tokenAmountInput.youPay")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenNativeValue?.tokenValue}
          onClick={() => console.log("open modal")}
          onSetTokenValue={(value) => setSelectedTokenAValue(value)}
          selectDisabled={true}
        />
        <TokenAmountInput
          tokenText={selectedTokenB?.tokenSymbol}
          labelText={t("tokenAmountInput.youPay")}
          tokenIcon={<DotToken />}
          tokenValue={selectedTokenAssetValue?.tokenValue}
          onClick={() => setIsModalOpen(true)}
          onSetTokenValue={(value) => setSelectedTokenBValue(value)}
        />
        <div className="mt-1 text-small">{transferGasFeesMessage}</div>

        <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
          <div className="flex w-full justify-between text-medium font-normal text-gray-200">
            <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
            <span>15%</span>
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
                  disabled={slippageAuto}
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
          onClick={handlePool}
          variant={ButtonVariants.btnInteractivePink}
          disabled={returnButtonStatus() !== SwapAndPoolStatus.Deposit}
        >
          {returnButtonStatus()}
        </Button>

        <PoolSelectTokenModal
          onSelect={setSelectedTokenB}
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
          title={t("button.selectToken")}
        />

        <SwapAndPoolSuccessModal
          open={isSuccessModalOpen}
          onClose={closeSuccessModal}
          contentTitle={
            poolExists
              ? t("modal.addTooExistingPool.successfullyAddedLiquidity")
              : t("modal.createPool.poolSuccessfullyCreated")
          }
          tokenA={{
            value: selectedTokenNativeValue.tokenValue,
            symbol: selectedTokenA.nativeTokenSymbol,
            icon: <DotToken />,
          }}
          tokenB={{
            value: selectedTokenAssetValue.tokenValue,
            symbol: selectedTokenB.tokenSymbol,
            icon: <DotToken />,
          }}
          actionLabel={t("modal.added")}
        />
      </div>
      <WarningMessage
        show={assetTokenMinValueExceeded}
        message={t("pageError.minimalAmountRequirement", {
          token: selectedTokenB.tokenSymbol,
          value: assetTokenMinValue,
        })}
      />
    </div>
  );
};

export default CreatePool;
