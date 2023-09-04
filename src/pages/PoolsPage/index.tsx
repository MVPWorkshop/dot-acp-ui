import { useNavigate } from "react-router-dom";
import { POOLS_ADD_LIQUIDITY } from "../../app/router/routes";
import Button from "../../components/atom/Button";
import { ButtonVariants } from "../../global/enum";
import { ReactComponent as TokenIcon } from "../../assets/img/token-icon.svg";
import { useEffect, useState } from "react";
import { useAppContext } from "../../stateProvider";
import { getPoolReserves } from "../../services/poolServices";
import { toUnit } from "../../services/polkadotWalletServices";
import { formatBalance } from "@polkadot/util";
import PoolDataCard from "./PoolDataCard";
import { ApiPromise } from "@polkadot/api";
import NativeTokenIcon from "../../assets/img/dot-token.svg";
import AssetTokenIcon from "../../assets/img/test-token.svg";
import { LpTokenAsset } from "../../global/types";
import dotAcpToast from "../../helper/toast";

type PoolCardProps = {
  name: string;
  lpTokenAsset: LpTokenAsset | null;
  totalTokensLocked: {
    nativeToken: string;
    nativeTokenIcon: string;
    assetToken: string;
    assetTokenIcon: string;
  };
};

const PoolsPage = () => {
  const [poolCardsData, setPoolCardsData] = useState<PoolCardProps[]>([]);
  const { state } = useAppContext();
  const { api, pools, selectedAccount, tokenBalances } = state;
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
          const lpTokenId = pool[1].lpToken;

          const lpTokenAsset = await apiPool.query.poolAssets.account(lpTokenId, selectedAccount?.address);

          const lpToken = lpTokenAsset.toHuman() as LpTokenAsset;

          if (pool[0][1].interior?.X2) {
            const poolReserve: any = await getPoolReserves(
              apiPool,
              pool[0][1].interior.X2[1].GeneralIndex.replace(/[, ]/g, "")
            );

            if (poolReserve?.length > 0) {
              const assetTokenMetadata: any = await apiPool.query.assets.metadata(
                pool[0][1].interior.X2[1].GeneralIndex.replace(/[, ]/g, "")
              );

              const assetTokenBalance = toUnit(
                poolReserve[1].replace(/[, ]/g, ""),
                assetTokenMetadata.toHuman().decimals
              );

              const nativeTokenBalance = formatBalance(poolReserve[0].replace(/[, ]/g, ""), {
                withUnit: false,
                withSi: false,
              });

              poolCardsArray.push({
                name: `WND–${assetTokenMetadata.toHuman().symbol}`,
                lpTokenAsset: lpToken ? lpToken : null,
                totalTokensLocked: {
                  nativeToken: nativeTokenBalance,
                  nativeTokenIcon: NativeTokenIcon,
                  assetToken: assetTokenBalance.toString(),
                  assetTokenIcon: AssetTokenIcon,
                },
              });
            }
          }
        })
      );

      setPoolCardsData(poolCardsArray);
    } catch (error) {
      dotAcpToast.error(`Error fetching pools: ${error}`);
    }
  };

  useEffect(() => {
    let mount = true;

    if (api && mount && pools && selectedAccount) {
      createPoolCardsArray();
    }

    return () => {
      mount = false;
    };
  }, [api, selectedAccount]);

  return (
    <div className="flex items-center justify-center px-28 pb-16">
      <div className="flex w-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex flex-col  gap-[4px] leading-[120%]">
            <div className="font-unbounded-variable text-heading-5 font-[700] tracking-[.046px] text-text-color-header-light">
              Pools
            </div>
            <div className="tracking-[.2px] text-text-color-body-light">Earn fees by providing liquidity.</div>
          </div>
          <div>
            <Button
              onClick={navigateToAddLiquidity}
              variant={ButtonVariants.btnPrimaryPinkLg}
              // size={ButtonText.btnTextMedium}
              disabled={selectedAccount && tokenBalances ? false : true}
            >
              New Position
            </Button>
          </div>
        </div>
        {pools && selectedAccount ? (
          <div className="grid grid-cols-3 gap-4">
            {poolCardsData.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <PoolDataCard
                    tokenPair={item.name}
                    nativeTokens={item.totalTokensLocked.nativeToken}
                    assetTokens={item.totalTokensLocked.assetToken}
                    lpTokenAsset={item.lpTokenAsset}
                    assetTokenIcon={item.totalTokensLocked.assetTokenIcon}
                    nativeTokenIcon={item.totalTokensLocked.nativeTokenIcon}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[664px] flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6">
            <TokenIcon />
            <div className="text-center text-text-color-body-light">
              {selectedAccount ? "No active liquidity positions." : "Connect your wallet to view your positions."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PoolsPage;
