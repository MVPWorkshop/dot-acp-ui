import { ApiPromise } from "@polkadot/api";
import dotAcpToast from "../../app/util/toast";
import { SwapAction } from "../../store/swap/interface";
import { Dispatch } from "react";
import { ActionType, ServiceResponseStatus } from "../../app/types/enum";
import { getWalletBySource, type WalletAccount } from "@talismn/connect-wallets";

export const swapNativeForAssetExactIn = async (
  api: ApiPromise,
  assetTokenId: string,
  account: WalletAccount,
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

  dispatch({ type: ActionType.SET_SWAP_LOADING, payload: true });

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    reverse ? [secondArg, firstArg] : [firstArg, secondArg],
    reverse ? assetTokenValue : nativeTokenValue,
    reverse ? nativeTokenValue : assetTokenValue,
    account.address,
    false
  );

  const wallet = getWalletBySource(account.wallet?.extensionName);

  result
    .signAndSend(account.address, { signer: wallet?.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === ServiceResponseStatus.Finalized && response.dispatchError) {
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          } else {
            dotAcpToast.error(response.dispatchError.toString());
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === ServiceResponseStatus.Finalized && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
            payload: "",
          });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEE,
            payload: "",
          });
          dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
        payload: "",
      });
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEE,
        payload: "",
      });
      dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
    });

  return result;
};

export const swapNativeForAssetExactOut = async (
  api: ApiPromise,
  assetTokenId: string,
  account: WalletAccount,
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

  dispatch({ type: ActionType.SET_SWAP_LOADING, payload: true });

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    reverse ? [firstArg, secondArg] : [secondArg, firstArg],
    reverse ? nativeTokenValue : assetTokenValue,
    reverse ? assetTokenValue : nativeTokenValue,
    account.address,
    false
  );

  const wallet = getWalletBySource(account.wallet?.extensionName);

  result
    .signAndSend(account.address, { signer: wallet?.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === ServiceResponseStatus.Finalized && response.dispatchError) {
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          } else {
            dotAcpToast.error(response.dispatchError.toString());
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === ServiceResponseStatus.Finalized && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
            payload: "",
          });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEE,
            payload: "",
          });
          dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
        payload: "",
      });
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEE,
        payload: "",
      });
      dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
    });

  return result;
};

export const swapAssetForAssetExactIn = async (
  api: ApiPromise,
  assetTokenAId: string,
  assetTokenBId: string,
  account: WalletAccount,
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

  dispatch({ type: ActionType.SET_SWAP_LOADING, payload: true });

  const result = api.tx.assetConversion.swapExactTokensForTokens(
    [firstArg, secondArg, thirdArg],
    assetTokenAValue,
    assetTokenBValue,
    account.address,
    false
  );

  const wallet = getWalletBySource(account.wallet?.extensionName);

  result
    .signAndSend(account.address, { signer: wallet?.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === ServiceResponseStatus.Finalized && response.dispatchError) {
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          } else {
            dotAcpToast.error(response.dispatchError.toString());
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === ServiceResponseStatus.Finalized && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
            payload: "",
          });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEE,
            payload: "",
          });
          dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
        payload: "",
      });
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEE,
        payload: "",
      });
      dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
    });

  return result;
};

export const swapAssetForAssetExactOut = async (
  api: ApiPromise,
  assetTokenAId: string,
  assetTokenBId: string,
  account: WalletAccount,
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

  dispatch({ type: ActionType.SET_SWAP_LOADING, payload: true });

  const result = api.tx.assetConversion.swapTokensForExactTokens(
    [firstArg, secondArg, thirdArg],
    assetTokenAValue,
    assetTokenBValue,
    account.address,
    false
  );

  const wallet = getWalletBySource(account.wallet?.extensionName);

  result
    .signAndSend(account.address, { signer: wallet?.signer }, (response) => {
      if (response.status.isInBlock) {
        dotAcpToast.success(`Completed at block hash #${response.status.asInBlock.toString()}`, {
          style: {
            maxWidth: "750px",
          },
        });
      } else {
        if (response.status.type === ServiceResponseStatus.Finalized && response.dispatchError) {
          if (response.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(response.dispatchError.asModule);
            const { docs } = decoded;
            dotAcpToast.error(`${docs.join(" ")}`);
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          } else {
            dotAcpToast.error(response.dispatchError.toString());
            dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
          }
        } else {
          dotAcpToast.success(`Current status: ${response.status.type}`);
        }
        if (response.status.type === ServiceResponseStatus.Finalized && !response.dispatchError) {
          dispatch({ type: ActionType.SET_SWAP_FINALIZED, payload: true });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
            payload: "",
          });
          dispatch({
            type: ActionType.SET_SWAP_GAS_FEE,
            payload: "",
          });
          dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed: ${error}`);
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
        payload: "",
      });
      dispatch({
        type: ActionType.SET_SWAP_GAS_FEE,
        payload: "",
      });
      dispatch({ type: ActionType.SET_SWAP_LOADING, payload: false });
    });

  return result;
};

export const checkSwapNativeForAssetExactInGasFee = async (
  api: ApiPromise,
  assetTokenId: string | null,
  account: WalletAccount,
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
  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_SWAP_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};

export const checkSwapNativeForAssetExactOutGasFee = async (
  api: ApiPromise,
  assetTokenId: string | null,
  account: WalletAccount,
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
  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_SWAP_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};

export const checkSwapAssetForAssetExactInGasFee = async (
  api: ApiPromise,
  assetTokenAId: string | null,
  assetTokenBId: string | null,
  account: WalletAccount,
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
  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_SWAP_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};

export const checkSwapAssetForAssetExactOutGasFee = async (
  api: ApiPromise,
  assetTokenAId: string | null,
  assetTokenBId: string | null,
  account: WalletAccount,
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
  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_SWAP_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_SWAP_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};
