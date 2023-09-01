import { ApiPromise } from "@polkadot/api";
import { u8aToHex } from "@polkadot/util";

export const getAllPools = async (api: ApiPromise) => {
  const pools = await api.query.assetConversion.pools.entries();
  return pools.map(([key, value]) => [key.args[0].toHuman(), value.toHuman()]);
};

export const getPoolReserves = async (api: ApiPromise, assetTokenId: string) => {
  // wnd token - native
  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  // asset token
  const multiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();

  // concatenate  Uint8Arrays of input parameters
  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length);
  encodedInput.set(multiLocation2, 0); // Set array1 starting from index 0
  encodedInput.set(multiLocation, multiLocation2.length); // Set array2 starting from the end of array1

  // create Hex from concatenated u8a
  const encodedInputHex = u8aToHex(encodedInput);

  // call rpc state call where first parameter is method to be called and second one is Hex representation of encoded input parameters
  const reservers = await api.rpc.state.call("AssetConversionApi_get_reserves", encodedInputHex);

  // decode response
  const decoded = api.createType("Option<(u128, u128)>", reservers);

  return decoded.toHuman();
};
