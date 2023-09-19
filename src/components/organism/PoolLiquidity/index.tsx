import { t } from "i18next";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType, ButtonVariants } from "../../../app/types/enum";
import { calculateSlippageReduce, formatDecimalsFromToken, formatInputTokenValue } from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast";
import { toUnit } from "../../../services/polkadotWalletServices";
import {
  addLiquidity,
  checkAddPoolLiquidityGasFee,
  checkCreatePoolGasFee,
  createPool,
  getAllPools,
} from "../../../services/poolServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";
import PoolSelectTokenModal from "../PoolSelectTokenModal";
import { getAssetTokenFromNativeToken, getNativeTokenFromAssetToken } from "../../../services/tokenServices";

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

const PoolLiquidity = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const params = useParams();

  const { tokenBalances, api, selectedAccount, pools, transferGasFeesMessage, poolGasFee, poolCreated } = state;

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
  const [isPoolCardDeposit, setIsPoolCardDeposit] = useState<boolean>(false);

  const nativeTokenValue = formatInputTokenValue(
    selectedTokenNativeValue.tokenValue,
    selectedTokenA?.nativeTokenDecimals
  )
    .toLocaleString()
    .replace(/[, ]/g, "");
  const assetTokenValue = formatInputTokenValue(selectedTokenAssetValue.tokenValue, selectedTokenB.decimals)
    .toLocaleString()
    .replace(/[, ]/g, "");

  const navigateToPools = () => {
    navigate(POOLS_PAGE);
  };

  const checkIfPoolAlreadyExists = (id: string) => {
    let exists = false;

    pools?.forEach((pool: any) => {
      if (pool[0][1].interior?.X2) {
        if (pool[0][1].interior.X2[1].GeneralIndex.replace(/[, ]/g, "").toString() === id.toString()) {
          exists = true;
        }
      }
      if (pool[0][1]?.interior?.X2 && params?.id) {
        if (pool[0][1]?.interior?.X2[1]?.GeneralIndex.replace(/[, ]/g, "").toString() === params?.id) {
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

              setIsPoolCardDeposit(true);
            }
          }
        }
      }
    });

    setPoolExists(exists);
  };

  const handlePool = async () => {
    try {
      if (api) {
        if (!poolExists) {
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
        } else {
          await addLiquidity(
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
      }
    } catch (error) {
      dotAcpToast.error(`Error: ${error}`);
    }
  };

  const handlePoolGasFee = async () => {
    if (api) await checkCreatePoolGasFee(api, selectedTokenB.assetTokenId, selectedAccount, dispatch);
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
    setIsSuccessModalOpen(false);
    dispatch({ type: ActionType.SET_POOL_CREATED, payload: false });
    if (api) await getAllPools(api);
    navigateToPools();
  };

  const getPriceOfAssetTokenFromNativeToken = async (value: number) => {
    if (api) {
      const valueWithDecimals = formatInputTokenValue(value, selectedTokenA?.nativeTokenDecimals);

      const assetTokenPrice = await getAssetTokenFromNativeToken(api, selectedTokenB?.assetTokenId, valueWithDecimals);

      if (assetTokenPrice && slippageValue) {
        const assetTokenNoSemicolons = assetTokenPrice.toString().replace(/[, ]/g, "");

        const assetTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(assetTokenNoSemicolons),
          selectedTokenB?.decimals
        );

        const tokenWithSlippage = calculateSlippageReduce(assetTokenNoDecimals, slippageValue);
        const tokenWithSlippageFormatted = formatInputTokenValue(tokenWithSlippage, selectedTokenB?.decimals);

        console.log("slippage asset:", tokenWithSlippageFormatted);

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
        const nativeTokenNoSemicolons = nativeTokenPrice.toString().replace(/[, ]/g, "");

        const nativeTokenNoDecimals = formatDecimalsFromToken(
          parseFloat(nativeTokenNoSemicolons),
          selectedTokenA?.nativeTokenDecimals
        );

        const tokenWithSlippage = calculateSlippageReduce(nativeTokenNoDecimals, slippageValue);
        const tokenWithSlippageFormatted = formatInputTokenValue(tokenWithSlippage, selectedTokenB?.decimals);

        console.log("slippage native:", tokenWithSlippageFormatted);
        setSelectedTokenNativeValue({ tokenValue: nativeTokenNoDecimals });
        setNativeTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      }
    }
  };

  const setSelectedTokenAValue = (value: number) => {
    if (selectedTokenNativeValue && slippageValue) {
      const nativeTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(nativeTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenNativeValue({ tokenValue: value });
      setNativeTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      getPriceOfAssetTokenFromNativeToken(value);
    }
  };

  const setSelectedTokenBValue = (value: number) => {
    if (selectedTokenAssetValue && slippageValue) {
      const assetTokenSlippageValue = calculateSlippageReduce(value, slippageValue);
      const tokenWithSlippageFormatted = formatInputTokenValue(assetTokenSlippageValue, selectedTokenB?.decimals);
      setSelectedTokenAssetValue({ tokenValue: value });
      setAssetTokenWithSlippage({ tokenValue: parseInt(tokenWithSlippageFormatted) });
      getPriceOfNativeTokenFromAssetToken(value);
    }
  };

  const checkIfSwapIsPossible = () => {
    if (!selectedTokenA.nativeTokenSymbol || !selectedTokenB.assetTokenId) {
      return "Select Token";
    }
    if (selectedTokenNativeValue?.tokenValue <= 0 || selectedTokenAssetValue?.tokenValue <= 0) {
      return "Enter Amount";
    }
    if (selectedTokenNativeValue?.tokenValue > Number(tokenBalances?.balance)) {
      return `Insufficient ${selectedTokenA.nativeTokenSymbol} amount`;
    }
    if (selectedTokenNativeValue?.tokenValue + parseFloat(poolGasFee) / 1000 > Number(tokenBalances?.balance)) {
      return `Insufficient ${selectedTokenA.nativeTokenSymbol} amount`;
    }
    if (
      selectedTokenAssetValue?.tokenValue >
      Number(toUnit(selectedTokenB.assetTokenBalance.replace(/[, ]/g, ""), Number(selectedTokenB.decimals)))
    ) {
      return `Insufficient ${selectedTokenB.tokenSymbol} amount`;
    }
    if (selectedTokenA && selectedTokenB) {
      return "Deposit";
    }
  };

  useEffect(() => {
    setSelectedTokenA({
      nativeTokenSymbol: tokenBalances?.tokenSymbol as NativeTokenProps,
      nativeTokenDecimals: tokenBalances?.tokenDecimals as NativeTokenProps,
    });
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
    if (poolExists) {
      handleAddPoolLiquidityGasFee();
    }
  }, [nativeTokenValue && assetTokenValue]);

  useEffect(() => {
    if (poolCreated) setIsSuccessModalOpen(true);
  }, [poolCreated]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
  }, []);

  return (
    <div className="relative flex w-full max-w-[460px] flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
      <button className="absolute left-[18px] top-[18px]" onClick={navigateToPools}>
        <BackArrow width={24} height={24} />
      </button>
      <h3 className="heading-6 font-unbounded-variable font-normal">{t("poolsPage.addLiquidity")}</h3>
      <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-b-modal-header-border-color" />
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
        selectDisabled={isPoolCardDeposit}
      />
      <div className="mt-1 text-small">{transferGasFeesMessage}</div>

      <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
        <div className="flex w-full justify-between text-medium font-normal text-text-color-label-light">
          <div className="flex">{t("tokenAmountInput.slippageTolerance")}</div>
          <span>15%</span>
        </div>
        <div className="flex w-full gap-2">
          <div className="flex w-full basis-8/12 rounded-xl bg-white p-1 text-large font-normal text-text-color-header-light">
            <button
              className={`flex basis-1/2 justify-center rounded-lg  px-4 py-3 ${
                slippageAuto ? "bg-purple-100" : "bg-white"
              }`}
              onClick={() => {
                setSlippageAuto(true);
                setSlippageValue(15);
              }}
            >
              {t("tokenAmountInput.auto")}
            </button>
            <button
              className={`flex basis-1/2 justify-center rounded-lg px-4 py-3 ${
                slippageAuto ? "bg-white" : "bg-purple-100"
              }`}
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
                className="w-full rounded-lg bg-purple-100 p-2 text-large  text-text-color-label-light outline-none"
                placeholder="15"
                disabled={slippageAuto ? true : false}
              />
              <span className="absolute bottom-1/3 right-2 text-medium text-text-color-disabled-light">%</span>
            </div>
          </div>
        </div>

        {poolExists && !isPoolCardDeposit ? (
          <div className="flex rounded-lg bg-lime-500 px-4 py-2 text-medium font-normal text-cyan-700">
            {t("poolsPage.poolExists")}
          </div>
        ) : null}
      </div>

      <Button
        onClick={handlePool}
        variant={ButtonVariants.btnInteractivePink}
        disabled={checkIfSwapIsPossible() !== "Deposit"}
      >
        {checkIfSwapIsPossible()}
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
  );
};

export default PoolLiquidity;
