import { ApiPromise } from "@polkadot/api";
import { web3FromSource } from "@polkadot/extension-dapp";
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
