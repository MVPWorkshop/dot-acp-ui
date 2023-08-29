// import { ApiPromise } from "@polkadot/api";

// export const createPool = async (api: ApiPromise, tokenId: string, wallet: string) => {
//       const res = await api.tx.assetConversion.createPool(
//         {"parents":0,"interior":{"here":null}},
//         {"parents":0,"interior":{"x2":[{"palletInstance":50},{"generalIndex":tokenId}]}}
//     ).signAndSend(wallet);
//     console.log(res);
//     return res
// }

import { ApiPromise } from "@polkadot/api";

export const createPool = async (api: ApiPromise, assetTokenId: string, walletAddress: string) => {
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

  const res = await api.tx.assetConversion.createPool(firstArg, secondArg).signAndSend(walletAddress);

  console.log(res.toHuman());
  return res;
};

export const addLiquidity = async (
  api: ApiPromise,
  assetTokenId: string,
  walletAddress: string,
  nativeToken: string,
  assetToken: string,
  minNativeToken: string,
  minAssetToken: string
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

  const res = await api.tx.assetConversion
    .addLiquidity(
      firstArg,
      secondArg,
      nativeToken, // desired amount of token1 to provide as liquidity (calculations happen when tx in executed)
      assetToken, // desired amount of token2 to provide as liquidity
      minNativeToken, // minimum amount of token1 to provide as liquidity
      minAssetToken, // minimum amount of token2 to provide as liquidity
      walletAddress // address to mint LP tokens
    )
    .signAndSend(walletAddress);
  console.log(res.toHuman());
  return res;
};
