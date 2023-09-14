import { ApiPromise } from "@polkadot/api";
import { web3FromSource } from "@polkadot/extension-dapp";
import { u8aToHex } from "@polkadot/util";
import dotAcpToast from "../../app/util/toast";
import { SwapAction } from "../../store/swap/interface";
import { Dispatch } from "react";
import { ActionType } from "../../app/types/enum";

export const swapNativeForAssetExactIn = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  reverse: boolean,
  dispatch: Dispatch<SwapAction>
) => {
  // WND - NATIVE TOKEN - here we add the slippage
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  // RASTA ex. - ASSET TOKEN
  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    reverse ? [secondArg, firstArg] : [firstArg, secondArg], // path array
    reverse ? assetTokenValue : nativeTokenValue, // amount of tokens to swap - here we add the slippage
    reverse ? nativeTokenValue : assetTokenValue, // minimum amount of token2 user wants to receive
    account.address, // address to receive swapped tokens
    false // Keep alive parameter
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
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
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
          } else {
            dotAcpToast.error(response.dispatchError.toString());
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      console.log(`Transaction failed ${error}`);
    });

  return result;
};

export const swapNativeForAssetExactOut = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  reverse: boolean,
  dispatch: Dispatch<SwapAction>
) => {
  // WND - NATIVE TOKEN
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  // RASTA ex. - ASSET TOKEN
  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    reverse ? [firstArg, secondArg] : [secondArg, firstArg], // path array
    reverse ? nativeTokenValue : assetTokenValue, // amount of tokens to get
    reverse ? assetTokenValue : nativeTokenValue, // maximum amount of tokens to spend
    account.address, // address to receive swapped tokens
    false // Keep alive parameter
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
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
          console.log("success");
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
          } else {
            dotAcpToast.error(response.dispatchError.toString());
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      console.log(`Transaction failed ${error}`);
    });

  return result;
};

export const swapAssetForAssetExactIn = async (
  api: ApiPromise,
  assetTokenAId: string,
  assetTokenBId: string,
  account: any,
  assetTokenAValue: string,
  assetTokenBValue: string,
  dispatch: Dispatch<SwapAction>
) => {
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenAId }],
      },
    })
    .toU8a();
  // WND - NATIVE TOKEN - here we add the slippage
  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  // RASTA ex. - ASSET TOKEN
  const thirdArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenBId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    [firstArg, secondArg, thirdArg], // path array
    assetTokenAValue, // amount of tokens to swap - here we add the slippage
    assetTokenBValue, // minimum amount of token2 user wants to receive
    account.address, // address to receive swapped tokens
    false // Keep alive parameter
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
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
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
          } else {
            dotAcpToast.error(response.dispatchError.toString());
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      console.log(`Transaction failed ${error}`);
    });

  return result;
};

export const swapAssetForAssetExactOut = async (
  api: ApiPromise,
  assetTokenAId: string,
  assetTokenBId: string,
  account: any,
  assetTokenAValue: string,
  assetTokenBValue: string,
  dispatch: Dispatch<SwapAction>
) => {
  const firstArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenAId }],
      },
    })
    .toU8a();
  // WND - NATIVE TOKEN - here we add the slippage
  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  // RASTA ex. - ASSET TOKEN
  const thirdArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenBId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    [firstArg, secondArg, thirdArg], // path array
    assetTokenAValue, // amount of tokens to get
    assetTokenBValue, // maximum amount of tokens to spend
    account.address, // address to receive swapped tokens
    false // Keep alive parameter
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
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
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
          } else {
            dotAcpToast.error(response.dispatchError.toString());
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      console.log(`Transaction failed ${error}`);
    });

  return result;
};

export const getAssetTokenFromNativeToken = async (
  api: ApiPromise,
  assetTokenId: string | null,
  nativeTokenValue: string
) => {
  // get input parameters as encoded SCALE Uint8Array
  const multiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const amount = api.createType("u128", nativeTokenValue).toU8a();
  const bool = api.createType("bool", false).toU8a();

  // concatenate  Uint8Arrays of input parameters
  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length + amount.length + bool.length);
  encodedInput.set(multiLocation, 0); // Set array1 starting from index 0
  encodedInput.set(multiLocation2, multiLocation.length); // Set array2 starting from the end of array1
  encodedInput.set(amount, multiLocation.length + multiLocation2.length); // Set array3 starting from the end of array1 + array2
  encodedInput.set(bool, multiLocation.length + multiLocation2.length + amount.length); // Set array3 starting from the end of array1 + array2

  // create Hex from concatenated u8a
  const encodedInputHex = u8aToHex(encodedInput);

  // call rpc state call where first parameter is method to be called and second one is Hex representation of encoded input parameters
  const response = await api.rpc.state.call("AssetConversionApi_quote_price_tokens_for_exact_tokens", encodedInputHex);

  // decode response
  const decodedPrice = api.createType("Option<u128>", response);

  return decodedPrice.toHuman();
};

export const getNativeTokenFromAssetToken = async (
  api: ApiPromise,
  assetTokenId: string | null,
  assetTokenValue: string
) => {
  // get input parameters as encoded SCALE Uint8Array
  const multiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();
  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();
  const amount = api.createType("u128", assetTokenValue).toU8a();
  const bool = api.createType("bool", false).toU8a();

  // concatenate  Uint8Arrays of input parameters
  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length + amount.length + bool.length);
  encodedInput.set(multiLocation, 0); // Set array1 starting from index 0
  encodedInput.set(multiLocation2, multiLocation.length); // Set array2 starting from the end of array1
  encodedInput.set(amount, multiLocation.length + multiLocation2.length); // Set array3 starting from the end of array1 + array2
  encodedInput.set(bool, multiLocation.length + multiLocation2.length + amount.length); // Set array3 starting from the end of array1 + array2

  // create Hex from concatenated u8a
  const encodedInputHex = u8aToHex(encodedInput);

  // call rpc state call where first parameter is method to be called and second one is Hex representation of encoded input parameters
  const response = await api.rpc.state.call("AssetConversionApi_quote_price_exact_tokens_for_tokens", encodedInputHex);

  // decode response
  const decodedprice = api.createType("Option<u128>", response);

  return decodedprice.toHuman();
};

const concatAndHexEncodeU8A = (array1: Uint8Array, array2: Uint8Array, array3: Uint8Array, array4: Uint8Array) => {
  const encodedInput3 = new Uint8Array(array1.length + array2.length + array3.length + array4.length);

  encodedInput3.set(array1, 0); // Set array1 starting from index 0
  encodedInput3.set(array2, array1.length); // Set array2 starting from the end of array1
  encodedInput3.set(array3, array1.length + array2.length); // Set array3 starting from the end of array1 + array2
  encodedInput3.set(array4, array1.length + array2.length + array3.length); // Set array3 starting from the end of array1 + array2
  const encodedInputHex3 = u8aToHex(encodedInput3);

  return encodedInputHex3;
};

export const getAssetTokenAFromAssetTokenB = async (
  api: ApiPromise,
  assetToken2Value: string,
  assetToken1Id: string,
  assetToken2Id: string
) => {
  // get input parameters as encoded SCALE Uint8Array
  const multiLocation1 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken1Id }],
      },
    })
    .toU8a();

  const nativeTokenMultiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken2Id }],
      },
    })
    .toU8a();

  const token2Amount = api.createType("u128", assetToken2Value).toU8a(); // user's input: _token2Amount_ (amount of token2 he wants to get after swap)

  const bool = api.createType("bool", false).toU8a();

  // this is u8a concatenation and hex encoding similar to one in get pool reserves calls, just with 4 parameters instead of 2
  // this logic was shown more simply (moved into a function) so there wouldn't be too much repetition in examples
  const encodedInputHex = concatAndHexEncodeU8A(nativeTokenMultiLocation, multiLocation2, token2Amount, bool);

  // call rpc state call where first parameter is method to be called and second one is Hex representation of encoded input parameters
  const response = await api.rpc.state.call("AssetConversionApi_quote_price_tokens_for_exact_tokens", encodedInputHex);

  // decode response
  const decodedAmount = api.createType("Option<u128>", response);
  // get amount for second rpc call
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
  // get input parameters as encoded SCALE Uint8Array
  const multiLocation1 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken1Id }],
      },
    })
    .toU8a();

  const nativeTokenMultiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetToken2Id }],
      },
    })
    .toU8a();

  const token1Amount = api.createType("u128", assetToken1Value).toU8a(); // user's input: _token1Amount_ (amount of token1 he wants to spend in swap)
  const bool = api.createType("bool", false).toU8a();

  // this is u8a concatenation and hex encoding similar to one in get pool reserves calls, just with 4 parameters instead of 2
  // this logic was shown more simply (moved into a function) so there wouldn't be too much repetition in examples
  const encodedInputHex = concatAndHexEncodeU8A(multiLocation1, nativeTokenMultiLocation, token1Amount, bool);

  // call rpc state call where first parameter is method to be called and second one is Hex representation of encoded input parameters
  const response = await api.rpc.state.call("AssetConversionApi_quote_price_exact_tokens_for_tokens", encodedInputHex);

  // decode response
  const decodedAmount = api.createType("Option<u128>", response);

  // get amount for second rpc call
  const amountOfNativetTokens = api.createType("u128", BigInt(decodedAmount.toString())).toU8a();

  const encodedInputHex2 = concatAndHexEncodeU8A(nativeTokenMultiLocation, multiLocation2, amountOfNativetTokens, bool);

  const response2 = await api.rpc.state.call(
    "AssetConversionApi_quote_price_exact_tokens_for_tokens",
    encodedInputHex2
  );

  const decodedAmount2 = api.createType("Option<u128>", response2);

  return decodedAmount2.toHuman();
};
