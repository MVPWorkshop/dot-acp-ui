import classNames from "classnames";
import Decimal from "decimal.js";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { POOLS_PAGE } from "../../../app/router/routes";
import { LpTokenAsset } from "../../../app/types";
import { ActionType, ButtonVariants, LiquidityPageType } from "../../../app/types/enum";
import {
  calculateSlippageReduce,
  formatDecimalsFromToken,
  formatInputTokenValue,
  truncateDecimalNumber,
} from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast";
import { ReactComponent as BackArrow } from "../../../assets/img/back-arrow.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ReactComponent as AssetTokenIcon } from "../../../assets/img/test-token.svg";
import { lottieOptions } from "../../../assets/loader";
import { assetTokenData, setTokenBalanceUpdate } from "../../../services/polkadotWalletServices";
import { checkWithdrawPoolLiquidityGasFee, getPoolReserves, removeLiquidity } from "../../../services/poolServices";
import { useAppContext } from "../../../state";
import Button from "../../atom/Button";
import WarningMessage from "../../atom/WarningMessage";
import AmountPercentage from "../../molecule/AmountPercentage";
import TokenAmountInput from "../../molecule/TokenAmountInput";
import PoolSelectTokenModal from "../PoolSelectTokenModal";
import SwapAndPoolSuccessModal from "../SwapAndPoolSuccessModal";

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
  tokenValue: string;
};

const WithdrawPoolLiquidity = () => {
  const { state, dispatch } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const {
    tokenBalances,
    api,
    selectedAccount,
    pools,
    transferGasFeesMessage,
    successModalOpen,
    withdrawLiquidityLoading,
    exactNativeTokenWithdraw,
    exactAssetTokenWithdraw,
    assetLoading,
    isTokenCanNotCreateWarningPools,
  } = state;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
  const [lpTokensAmountToBurn, setLpTokensAmountToBurn] = useState<string>("");
  const [minimumTokenAmountExceeded, setMinimumTokenAmountExceeded] = useState<boolean>(false);
  const [withdrawAmountPercentage, setWithdrawAmountPercentage] = useState<number>(100);
  const [maxPercentage, setMaxPercentage] = useState<number>(100);

  const navigateToPools = () => {
    navigate(POOLS_PAGE);
  };

  const populateAssetToken = () => {
    pools?.forEach(async (pool: any) => {
      if (pool?.[0]?.[1]?.interior?.X2) {
        if (pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "").toString() === params?.id) {
          if (params?.id) {
            if (api) {
              const tokenAlreadySelected: any = await assetTokenData(params?.id, api);
              if (tokenAlreadySelected) {
                setSelectedTokenB({
                  tokenSymbol: tokenAlreadySelected?.assetTokenMetadata?.symbol,
                  assetTokenId: params?.id,
                  decimals: tokenAlreadySelected?.assetTokenMetadata?.decimals,
                  assetTokenBalance: "0",
                });
              }
            }
          }
        }
      }
    });
  };

  const handlePool = async () => {
    const lpToken = Math.floor(Number(lpTokensAmountToBurn) * (withdrawAmountPercentage / 100)).toString();

    try {
      if (api) {
        await removeLiquidity(
          api,
          selectedTokenB.assetTokenId,
          selectedAccount,
          lpToken,
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

  const handleWithdrawPoolLiquidityGasFee = async () => {
    if (api)
      await checkWithdrawPoolLiquidityGasFee(
        api,
        selectedTokenB.assetTokenId,
        selectedAccount,
        lpTokensAmountToBurn,
        nativeTokenWithSlippage.tokenValue.toString(),
        assetTokenWithSlippage.tokenValue.toString(),
        dispatch
      );
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

  useEffect(() => {
    if (Object.keys(selectedAccount).length === 0) {
      navigateToPools();
    }
  }, [selectedAccount]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOKEN_CAN_NOT_CREATE_WARNING_POOLS, payload: false });
  }, [selectedTokenB.assetTokenId, selectedTokenNativeValue, selectedTokenAssetValue]);

  const getWithdrawButtonProperties = useMemo(() => {
    if (tokenBalances?.assets) {
      if (selectedTokenA && selectedTokenB) {
        if (minimumTokenAmountExceeded) {
          return { label: t("button.minimumTokenAmountExceeded"), disabled: true };
        } else {
          return { label: t("button.withdraw"), disabled: false };
        }
      }
    } else {
      return { label: t("button.connectWallet"), disabled: true };
    }

    return { label: "", disabled: true };
  }, [selectedTokenA.nativeTokenDecimals, selectedTokenB.decimals, minimumTokenAmountExceeded]);

  const getNativeAndAssetTokensFromPool = async () => {
    if (api) {
      const res: any = await getPoolReserves(api, selectedTokenB.assetTokenId);

      const assetTokenInfo: any = await api.query.assets.asset(selectedTokenB.assetTokenId);
      const assetTokenInfoMinBalance = assetTokenInfo.toHuman().minBalance?.replace(/[, ]/g, "");
      const nativeTokenExistentialDeposit: any = tokenBalances?.existentialDeposit.replace(/[, ]/g, "");
      const lpTokenTotalAsset: any = await api.query.poolAssets.asset(location?.state?.lpTokenId);

      const lpTotalAssetSupply = lpTokenTotalAsset.toHuman()?.supply?.replace(/[, ]/g, "");

      const lpTokenUserAccount = await api.query.poolAssets.account(
        location?.state?.lpTokenId,
        selectedAccount?.address
      );

      const lpTokenUserAsset = lpTokenUserAccount.toHuman() as LpTokenAsset;
      const lpTokenUserAssetBalance = parseInt(lpTokenUserAsset?.balance?.replace(/[, ]/g, ""));

      setLpTokensAmountToBurn(lpTokenUserAssetBalance.toFixed(0));

      if (res && slippageValue) {
        const nativeTokenInPool = new Decimal(res[0]?.replace(/[, ]/g, ""));
        const nativeTokenOut = nativeTokenInPool
          .mul(new Decimal(lpTokenUserAssetBalance).toNumber())
          .dividedBy(new Decimal(lpTotalAssetSupply).toNumber())
          .floor()
          .toNumber();

        const assetInPool = new Decimal(res[1]?.replace(/[, ]/g, ""));
        const assetOut = assetInPool
          .mul(new Decimal(lpTokenUserAssetBalance).toNumber())
          .dividedBy(new Decimal(lpTotalAssetSupply).toNumber())
          .floor()
          .toNumber();

        const nativeTokenOutFormatted =
          formatDecimalsFromToken(nativeTokenOut, selectedTokenA?.nativeTokenDecimals) *
          (withdrawAmountPercentage / 100);
        const assetOutFormatted =
          formatDecimalsFromToken(assetOut, selectedTokenB?.decimals) * (withdrawAmountPercentage / 100);

        const nativeTokenOutSlippage = calculateSlippageReduce(nativeTokenOutFormatted, slippageValue);
        const nativeTokenOutSlippageFormatted = formatInputTokenValue(
          nativeTokenOutSlippage,
          selectedTokenA?.nativeTokenDecimals
        );

        const assetOutSlippage = calculateSlippageReduce(assetOutFormatted, slippageValue);
        const assetOutSlippageFormatted = formatInputTokenValue(assetOutSlippage, selectedTokenB?.decimals);

        const minimumTokenAmountExceededCheck =
          assetInPool.sub(assetOut * (withdrawAmountPercentage / 100)).lessThanOrEqualTo(assetTokenInfoMinBalance) ||
          nativeTokenInPool
            .sub(nativeTokenOut * (withdrawAmountPercentage / 100))
            .lessThanOrEqualTo(nativeTokenExistentialDeposit);
        const nativeMinimumTokenAmountExceededCheck =
          assetInPool.sub(assetOut).lessThanOrEqualTo(assetTokenInfoMinBalance) ||
          nativeTokenInPool.sub(nativeTokenOut).lessThanOrEqualTo(nativeTokenExistentialDeposit);

        setMinimumTokenAmountExceeded(minimumTokenAmountExceededCheck);

        setSelectedTokenNativeValue({
          tokenValue: formatDecimalsFromToken(nativeTokenOut, selectedTokenA?.nativeTokenDecimals).toString(),
        });

        setNativeTokenWithSlippage({ tokenValue: nativeTokenOutSlippageFormatted });

        setSelectedTokenAssetValue({
          tokenValue: formatDecimalsFromToken(assetOut, selectedTokenB?.decimals).toString(),
        });
        setAssetTokenWithSlippage({ tokenValue: assetOutSlippageFormatted });

        const max = calculateMaxPercent(
          selectedTokenNativeValue?.tokenValue || "0",
          selectedTokenAssetValue?.tokenValue || "0",
          selectedTokenA.nativeTokenDecimals,
          selectedTokenB.decimals,
          nativeTokenExistentialDeposit,
          assetTokenInfoMinBalance
        );
        setMaxPercentage(nativeMinimumTokenAmountExceededCheck ? truncateDecimalNumber(max) : 100);
      }
    }
  };

  const calculatePercentage = (value: number, baseValue: number) => {
    const result = new Decimal(value - baseValue).dividedBy(value).times(100).toNumber();
    return result;
  };

  const calculateMaxPercent = (
    selectedTokenNativeValue: string,
    selectedTokenAssetValue: string,
    selectedTokenA: string,
    selectedTokenB: string,
    nativeTokenExistentialDeposit: number,
    assetTokenInfoMinBalance: number
  ) => {
    const selectedTokenAPow = Number(
      formatInputTokenValue(new Decimal(selectedTokenNativeValue).toNumber(), selectedTokenA)
    );
    const selectedTokenBPow = Number(
      formatInputTokenValue(new Decimal(selectedTokenAssetValue).toNumber(), selectedTokenB)
    );

    const percentA = calculatePercentage(selectedTokenAPow, nativeTokenExistentialDeposit);
    const percentB = calculatePercentage(selectedTokenBPow, assetTokenInfoMinBalance);

    return percentA < percentB ? percentA : percentB;
  };

  useEffect(() => {
    if (tokenBalances) {
      setSelectedTokenA({
        nativeTokenSymbol: tokenBalances?.tokenSymbol,
        nativeTokenDecimals: tokenBalances?.tokenDecimals,
      });
    }
  }, [tokenBalances]);

  useEffect(() => {
    if (selectedTokenNativeValue && selectedTokenAssetValue) {
      const nativeTokenValue = formatInputTokenValue(
        Number(selectedTokenNativeValue.tokenValue),
        selectedTokenA?.nativeTokenDecimals
      )
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      const assetTokenValue = formatInputTokenValue(Number(selectedTokenAssetValue.tokenValue), selectedTokenB.decimals)
        .toLocaleString()
        ?.replace(/[, ]/g, "");

      if (nativeTokenValue && assetTokenValue) {
        handleWithdrawPoolLiquidityGasFee();
      }
    }
  }, [selectedTokenNativeValue, selectedTokenAssetValue]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
  }, []);

  useEffect(() => {
    if (params?.id) {
      populateAssetToken();
    }
  }, [params?.id]);

  useEffect(() => {
    getNativeAndAssetTokensFromPool();
  }, [slippageValue, selectedTokenB.assetTokenId, selectedTokenNativeValue?.tokenValue, withdrawAmountPercentage]);

  const formattedTokenBValue = () => {
    let value = 0;

    if (Number(selectedTokenB?.decimals) > 0) {
      value = selectedTokenAssetValue?.tokenValue
        ? new Decimal(selectedTokenAssetValue?.tokenValue).times(withdrawAmountPercentage / 100).toNumber()
        : 0;
    } else {
      const percentValue = new Decimal(selectedTokenAssetValue?.tokenValue || 0)
        .times(withdrawAmountPercentage / 100)
        .toNumber();
      value = percentValue < 1 ? Math.ceil(percentValue) : Math.floor(percentValue);
    }

    return value.toString();
  };

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4">
      <div className="relative flex w-full flex-col items-center gap-1.5 rounded-2xl bg-white p-5">
        <button className="absolute left-[18px] top-[18px]" onClick={navigateToPools}>
          <BackArrow width={24} height={24} />
        </button>
        <h3 className="heading-6 font-unbounded-variable font-normal">
          {location?.state?.pageType === LiquidityPageType.removeLiquidity
            ? t("poolsPage.removeLiquidity")
            : t("poolsPage.addLiquidity")}
        </h3>
        <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
        <TokenAmountInput
          tokenText={selectedTokenA?.nativeTokenSymbol}
          labelText={t("poolsPage.withdrawalAmount")}
          tokenIcon={<DotToken />}
          tokenValue={
            selectedTokenNativeValue?.tokenValue
              ? new Decimal(selectedTokenNativeValue?.tokenValue).times(withdrawAmountPercentage / 100).toString()
              : ""
          }
          onClick={() => null}
          onSetTokenValue={() => null}
          selectDisabled={true}
          disabled={true}
          assetLoading={assetLoading}
          withdrawAmountPercentage={withdrawAmountPercentage}
        />
        <TokenAmountInput
          tokenText={selectedTokenB?.tokenSymbol}
          labelText={t("poolsPage.withdrawalAmount")}
          tokenIcon={<DotToken />}
          tokenValue={formattedTokenBValue()}
          onClick={() => setIsModalOpen(true)}
          onSetTokenValue={() => null}
          selectDisabled={true}
          disabled={true}
          assetLoading={assetLoading}
          withdrawAmountPercentage={withdrawAmountPercentage}
        />

        <AmountPercentage
          maxValue={maxPercentage}
          onChange={(value) => setWithdrawAmountPercentage(value)}
          disabled={withdrawLiquidityLoading}
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
                  disabled={slippageAuto || withdrawLiquidityLoading || assetLoading || !selectedAccount.address}
                />
                <span className="absolute bottom-1/3 right-2 text-medium text-gray-100">%</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => (getWithdrawButtonProperties.disabled ? null : handlePool())}
          variant={ButtonVariants.btnInteractivePink}
          disabled={getWithdrawButtonProperties.disabled || withdrawLiquidityLoading}
        >
          {withdrawLiquidityLoading ? (
            <Lottie options={lottieOptions} height={30} width={30} />
          ) : (
            getWithdrawButtonProperties.label
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
          contentTitle={t("modal.removeFromPool.successfulWithdrawal")}
          actionLabel={t("modal.removeFromPool.withdrawal")}
          tokenA={{
            value: exactNativeTokenWithdraw.toString(),
            symbol: selectedTokenA.nativeTokenSymbol,
            icon: <DotToken />,
          }}
          tokenB={{
            value: exactAssetTokenWithdraw.toString(),
            symbol: selectedTokenB.tokenSymbol,
            icon: <AssetTokenIcon width={24} height={24} />,
          }}
        />
      </div>
      <WarningMessage show={minimumTokenAmountExceeded} message={t("poolsPage.minimumAmountExceeded")} />
      <WarningMessage show={isTokenCanNotCreateWarningPools} message={t("pageError.tokenCanNotCreateWarning")} />
    </div>
  );
};

export default WithdrawPoolLiquidity;
