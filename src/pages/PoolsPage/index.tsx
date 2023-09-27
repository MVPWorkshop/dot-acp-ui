import { useNavigate } from "react-router-dom";
import { POOLS_ADD_LIQUIDITY } from "../../app/router/routes";
import Button from "../../components/atom/Button";
import { ActionType, ButtonVariants } from "../../app/types/enum";
import { ReactComponent as TokenIcon } from "../../assets/img/token-icon.svg";
import { useEffect } from "react";
import { useAppContext } from "../../state";
import { getPoolReserves } from "../../services/poolServices";
import PoolDataCard from "./PoolDataCard";
import { ApiPromise } from "@polkadot/api";
import NativeTokenIcon from "../../assets/img/dot-token.svg";
import AssetTokenIcon from "../../assets/img/test-token.svg";
import { LpTokenAsset, PoolCardProps } from "../../app/types";
import dotAcpToast from "../../app/util/toast";
import { t } from "i18next";
import { formatDecimalsFromToken } from "../../app/util/helper";

const PoolsPage = () => {
  const { state, dispatch } = useAppContext();
  const { api, selectedAccount, pools, poolsCards, tokenBalances } = state;

  const navigate = useNavigate();

  const navigateToAddLiquidity = () => {
    navigate(POOLS_ADD_LIQUIDITY);
  };

  const createPoolCardsArray = async () => {
    const apiPool = api as ApiPromise;

    try {
      const poolCardsArray: PoolCardProps[] = [];

      await Promise.all(
        pools.map(async (pool: any) => {
          const lpTokenId = pool?.[1]?.lpToken;

          let lpToken = null;
          if (selectedAccount?.address) {
            const lpTokenAsset = await apiPool.query.poolAssets.account(lpTokenId, selectedAccount?.address);
            lpToken = lpTokenAsset.toHuman() as LpTokenAsset;
          }

          if (pool?.[0]?.[1]?.interior?.X2) {
            const poolReserve: any = await getPoolReserves(
              apiPool,
              pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "")
            );

            if (poolReserve?.length > 0) {
              const assetTokenMetadata: any = await apiPool.query.assets.metadata(
                pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "")
              );

              const assetTokenBalance = formatDecimalsFromToken(
                poolReserve?.[1]?.replace(/[, ]/g, ""),
                assetTokenMetadata.toHuman()?.decimals
              );

              const nativeTokenBalance = formatDecimalsFromToken(poolReserve?.[0]?.replace(/[, ]/g, ""), "12");

              poolCardsArray.push({
                name: `WND–${assetTokenMetadata.toHuman()?.symbol}`,
                lpTokenAsset: lpToken ? lpToken : null,
                lpTokenId: lpTokenId,
                assetTokenId: pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, ""),
                totalTokensLocked: {
                  nativeToken: nativeTokenBalance.toFixed(3),
                  nativeTokenIcon: NativeTokenIcon,
                  assetToken: assetTokenBalance.toFixed(3),
                  assetTokenIcon: AssetTokenIcon,
                },
              });
            }
          }
        })
      );

      dispatch({ type: ActionType.SET_POOLS_CARDS, payload: poolCardsArray });
    } catch (error) {
      dotAcpToast.error(`Error fetching pools: ${error}`);
    }
  };

  useEffect(() => {
    let mount = true;

    if (api && mount && pools) {
      createPoolCardsArray();
    }

    return () => {
      mount = false;
    };
  }, [api, pools, selectedAccount]);

  return (
    <div className="flex items-center justify-center px-28 pb-16">
      <div className="flex w-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex flex-col  gap-[4px] leading-[120%]">
            <div className="font-unbounded-variable text-heading-5 font-[700] tracking-[.046px] text-gray-400">
              {t("poolsPage.pools")}
            </div>
            <div className="tracking-[.2px] text-gray-300">{t("poolsPage.earnFeesByProvidingLiquidity")}</div>
          </div>
          <div>
            {selectedAccount ? (
              <Button
                onClick={navigateToAddLiquidity}
                variant={ButtonVariants.btnPrimaryPinkLg}
                disabled={selectedAccount && tokenBalances ? false : true}
              >
                {t("button.newPosition")}
              </Button>
            ) : null}
          </div>
        </div>
        {pools && poolsCards ? (
          <div className="grid grid-cols-3 gap-4">
            {poolsCards.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PoolDataCard
                    tokenPair={item.name}
                    nativeTokens={item.totalTokensLocked.nativeToken}
                    assetTokens={item.totalTokensLocked.assetToken}
                    lpTokenAsset={item.lpTokenAsset}
                    assetTokenIcon={item.totalTokensLocked.assetTokenIcon}
                    nativeTokenIcon={item.totalTokensLocked.nativeTokenIcon}
                    assetTokenId={item.assetTokenId}
                    lpTokenId={item.lpTokenId}
                    tokenBalances={tokenBalances?.balance}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[664px] flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6">
            <TokenIcon />
            <div className="text-center text-gray-300">
              {selectedAccount ? t("poolsPage.noActiveLiquidityPositions") : t("poolsPage.connectWalletToView")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PoolsPage;
