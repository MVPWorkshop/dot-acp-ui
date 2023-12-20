import { ApiPromise } from "@polkadot/api";
import type { AnyJson } from "@polkadot/types/types/codec";
import { u8aToHex } from "@polkadot/util";
import Decimal from "decimal.js";
import useGetNetwork from "../../app/hooks/useGetNetwork";
import { formatDecimalsFromToken } from "../../app/util/helper";

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

  const encodedInputHex2 = concatAndHexEncodeU8A(nativeTokenMultiLocation, multiLocation2, amountOfNativeTokens, bool);

  const response2 = await api.rpc.state.call(
    "AssetConversionApi_quote_price_exact_tokens_for_tokens",
    encodedInputHex2
  );

  const decodedAmount2 = api.createType("Option<u128>", response2);

  return decodedAmount2.toHuman();
};

export enum PriceCalcType {
  NativeFromAsset = "NativeFromAsset",
  AssetFromNative = "AssetFromNative",
  AssetFromAsset = "AssetFromAsset",
}

export const sellMax = async ({
  api,
  priceCalcType,
  tokenA,
  tokenBinPool,
}: {
  api: ApiPromise;
  priceCalcType: PriceCalcType;
  tokenA: {
    id: string;
    value: string;
    decimals: string;
    formattedValue: string;
  };
  tokenBinPool: {
    id: string;
    value: string;
    decimals: string;
    formattedValue: string;
  };
}) => {
  // Define a function that maps to the correct calculation method
  let calculateBForA: (x: Decimal) => Promise<AnyJson>;

  switch (priceCalcType) {
    case PriceCalcType.AssetFromAsset:
      calculateBForA = (tokenValueA) =>
        getAssetTokenBFromAssetTokenA(api, tokenValueA.toString(), tokenA.id, tokenBinPool.id!);
      break;
    case PriceCalcType.AssetFromNative:
      calculateBForA = (tokenValueA) => getAssetTokenFromNativeToken(api, tokenBinPool.id, tokenValueA.toString());
      break;
    case PriceCalcType.NativeFromAsset:
      calculateBForA = (tokenValueA) => getNativeTokenFromAssetToken(api, tokenA.id, tokenValueA.toString());
      break;
    default:
      throw new Error("Unsupported price calculation type");
  }

  let step = new Decimal(1);
  if (new Decimal(tokenA.decimals).gt(1)) {
    step = new Decimal(10).pow(new Decimal(tokenA.decimals).sub(new Decimal(tokenA.decimals).sub(2)));
  }

  // Use the findOptimalTokenA function with the appropriate calculation method
  const optimalTokenA = await findOptimalTokenA({
    tokenA: new Decimal(tokenA.value),
    maxTokenB: new Decimal(tokenBinPool.value),
    step,
    calculateBForA: calculateBForA,
  });

  console.log("optimalTokenA", optimalTokenA);
  console.log("optimalTokenA formatted", formatDecimalsFromToken(optimalTokenA, tokenA.decimals));
  // Do something with optimalTokenA
};

export const findOptimalTokenA = async ({
  tokenA,
  maxTokenB,
  step,
  calculateBForA,
}: {
  tokenA: Decimal;
  maxTokenB: Decimal;
  step: Decimal;
  calculateBForA: (x: Decimal) => Promise<AnyJson>;
}): Promise<Decimal> => {
  let low = new Decimal(0);
  let high = tokenA;
  let result = new Decimal(0);

  while (low.lte(high)) {
    const mid = low.plus(high).div(2).floor();
    const yForMid = new Decimal(((await calculateBForA(mid)) || 0).toString().replace(/[, ]/g, ""));

    if (yForMid.lte(maxTokenB)) {
      result = mid;
      low = mid.plus(step);
    } else {
      high = mid.minus(step);
    }
  }

  return result;
};
