import { ApiPromise } from "@polkadot/api";
import { web3FromSource } from "@polkadot/extension-dapp";
import dotAcpToast from "../../helper/toast";
// import { Dispatch } from "react";
// import { PoolAction } from "../../state/pools/interface";

export const getAllPools = async (api: ApiPromise) => {
  const pools = await api.query.assetConversion.pools.entries();
  console.log(pools.map(([key, value]) => [key.args[0].toHuman(), value.toHuman()]));

  return pools.map(([key, value]) => [key.args[0].toHuman(), value.toHuman()]);
};

export const createPool = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string
) => {
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.createPool(firstArg, secondArg);
  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      if (response.status.type === "Finalized") {
        addLiquidity(
          api,
          assetTokenId,
          account,
          nativeTokenValue,
          assetTokenValue,
          minNativeTokenValue,
          minAssetTokenValue
        );
      }
      if (response.status.isInBlock) {
        console.log(`Completed at block hash #${response.status.asInBlock.toString()}`);
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        console.log(`Current status: ${response.status.type}`);
        if (response.status.type === "Finalized" && response.dispatchError !== undefined) {
          dotAcpToast.error("Transaction failed");
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed ${error}`);
    });
};

export const addLiquidity = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string
) => {
  console.log("in");
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.addLiquidity(
    firstArg,
    secondArg,
    nativeTokenValue,
    assetTokenValue,
    minNativeTokenValue,
    minAssetTokenValue,
    account.address
  );
  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      //   console.log("liquid",response.toHuman());
      //   if (response.dispatchError !== undefined) {
      //     console.log(response.dispatchError.toHuman());
      //     return;
      //   }
      if (response.status.isInBlock) {
        console.log(`Completed at block hash #${response.status.asInBlock.toString()}`);
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        console.log(`Current status: ${response.status.type}`);
        if (response.status.type === "Finalized" && response.dispatchError !== undefined) {
          dotAcpToast.error("Transaction failed");
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed ${error}`);
    });
};
