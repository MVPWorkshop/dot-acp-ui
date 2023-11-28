import { ApiPromise } from "@polkadot/api";
import { u8aToHex } from "@polkadot/util";
import useGetNetwork from "../../app/hooks/useGetNetwork";

const { parents } = useGetNetwork();

export const getAssetTokenFromNativeToken = async (
  api: ApiPromise,
  assetTokenId: string | null,
  nativeTokenValue: string
) => {
  const multiLocation = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parents: parents,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const amount = api.createType("u128", nativeTokenValue).toU8a();
  const bool = api.createType("bool", false).toU8a();

  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length + amount.length + bool.length);
  encodedInput.set(multiLocation, 0);
  encodedInput.set(multiLocation2, multiLocation.length);
  encodedInput.set(amount, multiLocation.length + multiLocation2.length);
  encodedInput.set(bool, multiLocation.length + multiLocation2.length + amount.length);

  const encodedInputHex = u8aToHex(encodedInput);

  const response = await api.rpc.state.call("AssetConversionApi_quote_price_tokens_for_exact_tokens", encodedInputHex);

  const decodedPrice = api.createType("Option<u128>", response);

  return decodedPrice.toHuman();
};

export const getNativeTokenFromAssetToken = async (
  api: ApiPromise,
  assetTokenId: string | null,
  assetTokenValue: string
) => {
  const multiLocation = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parents: parents,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const amount = api.createType("u128", assetTokenValue).toU8a();
  const bool = api.createType("bool", false).toU8a();

  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length + amount.length + bool.length);
  encodedInput.set(multiLocation, 0);
  encodedInput.set(multiLocation2, multiLocation.length);
  encodedInput.set(amount, multiLocation.length + multiLocation2.length);
  encodedInput.set(bool, multiLocation.length + multiLocation2.length + amount.length);

  const encodedInputHex = u8aToHex(encodedInput);

  const response = await api.rpc.state.call("AssetConversionApi_quote_price_exact_tokens_for_tokens", encodedInputHex);

  const decodedPrice = api.createType("Option<u128>", response);

  return decodedPrice.toHuman();
};

const concatAndHexEncodeU8A = (array1: Uint8Array, array2: Uint8Array, array3: Uint8Array, array4: Uint8Array) => {
  const encodedInput3 = new Uint8Array(array1.length + array2.length + array3.length + array4.length);

  encodedInput3.set(array1, 0);
  encodedInput3.set(array2, array1.length);
  encodedInput3.set(array3, array1.length + array2.length);
  encodedInput3.set(array4, array1.length + array2.length + array3.length);
  const encodedInputHex3 = u8aToHex(encodedInput3);

  return encodedInputHex3;
};

export const getAssetTokenAFromAssetTokenB = async (
  api: ApiPromise,
  assetToken2Value: string,
  assetToken1Id: string,
  assetToken2Id: string
) => {
  const multiLocation1 = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken1Id }],
      },
    })
    .toU8a();

  const nativeTokenMultiLocation = api
    .createType("MultiLocation", {
      parents: parents,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken2Id }],
      },
    })
    .toU8a();

  const token2Amount = api.createType("u128", assetToken2Value).toU8a();

  const bool = api.createType("bool", false).toU8a();

  const encodedInputHex = concatAndHexEncodeU8A(nativeTokenMultiLocation, multiLocation2, token2Amount, bool);

  const response = await api.rpc.state.call("AssetConversionApi_quote_price_tokens_for_exact_tokens", encodedInputHex);

  const decodedAmount = api.createType("Option<u128>", response);

  const amountOfNativeTokens = api.createType("u128", BigInt(decodedAmount.toString())).toU8a();

  const encodedInputHex2 = concatAndHexEncodeU8A(multiLocation1, nativeTokenMultiLocation, amountOfNativeTokens, bool);

  const response2 = await api.rpc.state.call(
    "AssetConversionApi_quote_price_tokens_for_exact_tokens",
    encodedInputHex2
  );
  const decodedAmount2 = api.createType("Option<u128>", response2);

  return decodedAmount2.toHuman();
};

export const getAssetTokenBFromAssetTokenA = async (
  api: ApiPromise,
  assetToken1Value: string,
  assetToken1Id: string,
  assetToken2Id: string
) => {
  const multiLocation1 = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken1Id }],
      },
    })
    .toU8a();

  const nativeTokenMultiLocation = api
    .createType("MultiLocation", {
      parents: parents,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken2Id }],
      },
    })
    .toU8a();

  const token1Amount = api.createType("u128", assetToken1Value).toU8a();
  const bool = api.createType("bool", false).toU8a();

  const encodedInputHex = concatAndHexEncodeU8A(multiLocation1, nativeTokenMultiLocation, token1Amount, bool);

  const response = await api.rpc.state.call("AssetConversionApi_quote_price_exact_tokens_for_tokens", encodedInputHex);

  const decodedAmount = api.createType("Option<u128>", response);

  const amountOfNativeTokens = api.createType("u128", BigInt(decodedAmount.toString())).toU8a();
  // napraviti istu ovakvu funkciju i na ovoj liniji izracunati price impact za asset to native
  const encodedInputHex2 = concatAndHexEncodeU8A(nativeTokenMultiLocation, multiLocation2, amountOfNativeTokens, bool);

  const response2 = await api.rpc.state.call(
    "AssetConversionApi_quote_price_exact_tokens_for_tokens",
    encodedInputHex2
  );

  const decodedAmount2 = api.createType("Option<u128>", response2);
  // izracunati price impact za native to asset
  // saberem ta dva price impakta i prikazem ih, to je price imapct za asset to asset
  return decodedAmount2.toHuman();
};
