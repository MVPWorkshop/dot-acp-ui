import Button from "../../components/atom/Button";
import { ButtonVariants } from "../../global/enum";
import PoolsEmptyState from "../../components/molecule/poolsEmptyState";
import { useEffect, useState } from "react";
import { useAppContext } from "../../stateProvider";
import { getAllPools, getPoolReserves, createPool } from "../../services/poolServices";
import { toUnit } from "../../services/polkadotWalletServices";
import { formatBalance } from "@polkadot/util";
import PoolDataCard from "./PoolDataCard";
import { ApiPromise } from "@polkadot/api";
import NativeTokenIcon from "../../assets/img/dot-token.svg";
import AssetTokenIcon from "../../assets/img/test-token.svg";
import { LpTokenAsset } from "../../global/types";
import dotAcpToast from "../../helper/toast";

type PoolProps = {
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
  const [poolsData, setPoolsData] = useState<PoolProps[]>([]);
  const { state } = useAppContext();
  const { api, selectedAccount, pools } = state;

  const handleCreatePool = async () => {
    try {
      if (api) {
        await createPool(api, "47", selectedAccount, "1000000000000", "2000000000000", "1000000000000", "2");
      }
    } catch (error) {
      dotAcpToast.error(`Error: ${error}`);
    }
  };

  const fetchPools = async () => {
    const apiPool = api as ApiPromise;

    try {
      const allPools = await getAllPools(apiPool);

      const poolTest: PoolProps[] = [];

      await Promise.all(
        allPools.map(async (pool: any) => {
          const lpTokenId = pool[1].lpToken;

          const lpTokenAsset = await apiPool.query.poolAssets.account(lpTokenId, selectedAccount?.address);

          const lpToken = lpTokenAsset.toHuman() as LpTokenAsset;

          if (pool[0][1].interior?.X2) {
            if (pool[0][1].interior?.X2[1].GeneralIndex === "13,122") {
              console.log("pool:", pool);
            }
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

              poolTest.push({
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

      setPoolsData(poolTest);
    } catch (error) {
      dotAcpToast.error(`Error fetching pools: ${error}`);
    }
  };

  useEffect(() => {
    let mount = true;

    if (api && mount) {
      fetchPools();
    }

    return () => {
      mount = false;
    };
  }, [api]);

  return (
    <div className="flex items-center justify-center px-28">
      <div className="flex w-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex flex-col  gap-[4px] leading-[120%]">
            <div className="font-unbounded-variable text-heading-5 font-[700] tracking-[.046px] text-text-color-header-light">
              Pools
            </div>
            <div className="tracking-[.2px] text-text-color-body-light">Earn fees by providing liquidity.</div>
          </div>
          <div>
            <Button onClick={handleCreatePool} variant={ButtonVariants.btnPrimaryPinkLg}>
              New Position
            </Button>
          </div>
        </div>
        {!pools ? (
          <PoolsEmptyState />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {poolsData.map((item: any, index: number) => {
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
        )}
      </div>
    </div>
  );
};
export default PoolsPage;
