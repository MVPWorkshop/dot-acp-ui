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

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    reverse ? [secondArg, firstArg] : [firstArg, secondArg],
    reverse ? assetTokenValue : nativeTokenValue,
    reverse ? nativeTokenValue : assetTokenValue,
    account.address,
    false
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === "Finalized" && response.dispatchError) {
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
        if (response.status.type === "Finalized" && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
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

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    reverse ? [firstArg, secondArg] : [secondArg, firstArg],
    reverse ? nativeTokenValue : assetTokenValue,
    reverse ? assetTokenValue : nativeTokenValue,
    account.address,
    false
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === "Finalized" && response.dispatchError) {
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
        if (response.status.type === "Finalized" && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
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

  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const thirdArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenBId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    [firstArg, secondArg, thirdArg],
    assetTokenAValue,
    assetTokenBValue,
    account.address,
    false
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === "Finalized" && response.dispatchError) {
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
        if (response.status.type === "Finalized" && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
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

  const secondArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const thirdArg = api
    .createType("MultiLocation", {
      parents: 0,
      interior: {
        x2: [{ palletInstance: 50 }, { generalIndex: assetTokenBId }],
      },
    })
    .toU8a();

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    [firstArg, secondArg, thirdArg],
    assetTokenAValue,
    assetTokenBValue,
    account.address,
    false
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === "Finalized" && response.dispatchError) {
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
        if (response.status.type === "Finalized" && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
    });

  return result;
};
