import { t } from "i18next";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType, ButtonVariants } from "../../../app/types/enum";
import { calculateSlippage, formatInputTokenValue } from "../../../app/util/helper";
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
  const [slippageAuto, setSlippageAuto] = useState<boolean>(true);
  const [slippageValue, setSlippageValue] = useState<number | undefined>(15);
  const [poolExists, setPoolExists] = useState<boolean>(false);

  const nativeTokenValue = formatInputTokenValue(
    selectedTokenNativeValue.tokenValue,
    selectedTokenA?.nativeTokenDecimals
  )
    .toLocaleString()
    .replace(/[, ]/g, "");
  const assetTokenValue = formatInputTokenValue(selectedTokenAssetValue.tokenValue, selectedTokenB.decimals)
    .toLocaleString()
    .replace(/[, ]/g, "");

  const nativeTokenSlippageValue = calculateSlippage(nativeTokenValue, slippageValue)
    .toLocaleString()
    .replace(/[, ]/g, "");
  const assetTokenSlippageValue = calculateSlippage(assetTokenValue, slippageValue)
    .toLocaleString()
    .replace(/[, ]/g, "");

  const navigateToPools = () => {
    navigate(POOLS_PAGE);
  };

  const isPoolExists = (id: string) => {
    let exists = false;

    pools?.forEach((pool: any) => {
      if (pool[0][1].interior?.X2) {
        if (pool[0][1].interior.X2[1].GeneralIndex.replace(/[, ]/g, "").toString() === id.toString()) {
          exists = true;
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
            nativeTokenSlippageValue,
            assetTokenSlippageValue,
            dispatch
          );
        } else {
          await addLiquidity(
            api,
            selectedTokenB.assetTokenId,
            selectedAccount,
            nativeTokenValue,
            assetTokenValue,
            nativeTokenSlippageValue,
            assetTokenSlippageValue,
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
        nativeTokenSlippageValue,
        assetTokenSlippageValue,
        dispatch
      );
  };

  const closeSuccessModal = async () => {
    setIsSuccessModalOpen(false);
    dispatch({ type: ActionType.SET_POOL_CREATED, payload: false });
    if (api) await getAllPools(api);
    navigateToPools();
  };

  const setSelectedTokenAValue = (value: number) => {
    if (selectedTokenNativeValue) {
      setSelectedTokenNativeValue({ tokenValue: value });
    }
  };

  const setSelectedTokenBValue = (value: number) => {
    if (selectedTokenAssetValue) {
      setSelectedTokenAssetValue({ tokenValue: value });
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
    isPoolExists(selectedTokenB.assetTokenId);
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
      <h3 className="heading-6 font-unbounded-variable font-normal">Add Liquidity</h3>
      <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-b-modal-header-border-color" />
      <TokenAmountInput
        tokenText={selectedTokenA?.nativeTokenSymbol}
        labelText="You pay"
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenNativeValue?.tokenValue}
        onClick={() => console.log("open modal")}
        onSetTokenValue={(value) => setSelectedTokenAValue(value)}
      />
      <TokenAmountInput
        tokenText={selectedTokenB?.tokenSymbol}
        labelText="You receive"
        tokenIcon={<DotToken />}
        tokenValue={selectedTokenAssetValue?.tokenValue}
        onClick={() => setIsModalOpen(true)}
        onSetTokenValue={(value) => setSelectedTokenBValue(value)}
      />
      <div className="mt-1 text-small">{transferGasFeesMessage}</div>

      <div className="flex w-full flex-col gap-2 rounded-lg bg-purple-50 px-4 py-6">
        <>
          <div className="flex w-full justify-between text-medium font-normal text-text-color-label-light">
            <div className="flex">Slippage tolerance</div>
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
                Auto
              </button>
              <button
                className={`flex basis-1/2 justify-center rounded-lg px-4 py-3 ${
                  slippageAuto ? "bg-white" : "bg-purple-100"
                }`}
                onClick={() => setSlippageAuto(false)}
              >
                Custom
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
        </>

        {poolExists ? (
          <div className="flex rounded-lg bg-lime-500 px-4 py-2 text-medium font-normal text-cyan-700">
            No need to create a new pool. Liquidity can be added to the existing one.
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
        contentTitle={poolExists ? "Successful Added Liquidity" : "Pool Successfully Created"}
        tokenBValue={selectedTokenNativeValue.tokenValue}
        tokenAValue={selectedTokenAssetValue.tokenValue}
        tokenBSymbol={selectedTokenA.nativeTokenSymbol}
        tokenASymbol={selectedTokenB.tokenSymbol}
        tokenAIcon={<DotToken />}
        tokenBIcon={<DotToken />}
        actionLabel="added"
      />
    </div>
  );
};

export default PoolLiquidity;
