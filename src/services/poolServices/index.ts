import { ApiPromise } from "@polkadot/api";
import { web3FromSource } from "@polkadot/extension-dapp";
import { u8aToHex } from "@polkadot/util";
import { Dispatch } from "react";
import { ActionType } from "../../app/types/enum";
import dotAcpToast from "../../app/util/toast";
import { PoolAction } from "../../store/pools/interface";

export const getAllPools = async (api: ApiPromise) => {
  try {
    const pools = await api.query.assetConversion.pools.entries();

    return pools.map(([key, value]) => [key.args?.[0].toHuman(), value.toHuman()]);
  } catch (error) {
    dotAcpToast.error(`Error getting pools: ${error}`);
  }
};

export const getPoolReserves = async (api: ApiPromise, assetTokenId: string) => {
  const multiLocation2 = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        here: null,
      },
    })
    .toU8a();

  const multiLocation = api
    .createType("MultiLocation", {
      parent: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: assetTokenId }],
      },
    })
    .toU8a();

  const encodedInput = new Uint8Array(multiLocation.length + multiLocation2.length);
  encodedInput.set(multiLocation2, 0);
  encodedInput.set(multiLocation, multiLocation2.length);

  const encodedInputHex = u8aToHex(encodedInput);

  const reservers = await api.rpc.state.call("AssetConversionApi_get_reserves", encodedInputHex);

  const decoded = api.createType("Option<(u128, u128)>", reservers);

  return decoded.toHuman();
};

export const createPool = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string,
  dispatch: Dispatch<PoolAction>
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
          minAssetTokenValue,
          dispatch
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
        if (response.status.type === "Finalized") {
          dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed ${error}`);
      dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
    });
};

export const addLiquidity = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string,
  dispatch: Dispatch<PoolAction>
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

  const result = api.tx.assetConversion.addLiquidity(
    firstArg,
    secondArg,
    nativeTokenValue,
    assetTokenValue,
    minNativeTokenValue,
    minAssetTokenValue,
    account.address
  );

  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, async (response) => {
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
        if (response.status.type === "Finalized") {
          dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SUCCESS_MODAL_OPEN, payload: true });
          await getAllPools(api);
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed ${error}`);
      dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
    });
};

export const removeLiquidity = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  lpTokensAmountToBurn: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string,
  dispatch: Dispatch<PoolAction>
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

  const result = api.tx.assetConversion.removeLiquidity(
    firstArg,
    secondArg,
    lpTokensAmountToBurn,
    minNativeTokenValue,
    minAssetTokenValue,
    account.address
  );

  const injector = await web3FromSource(account?.meta.source);

  result
    .signAndSend(account.address, { signer: injector.signer }, async (response) => {
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
        if (response.status.type === "Finalized") {
          dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
        }
        if (response.status.type === "Finalized" && response.dispatchError === undefined) {
          dispatch({ type: ActionType.SET_SUCCESS_MODAL_OPEN, payload: true });
          await getAllPools(api);
        }
      }
    })
    .catch((error: any) => {
      dotAcpToast.error(`Transaction failed ${error}`);
      dispatch({ type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE, payload: "" });
    });
};

export const checkCreatePoolGasFee = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  dispatch: Dispatch<PoolAction>
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
  const { partialFee } = await result.paymentInfo(account.address);

  dispatch({
    type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_POOL_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};

export const checkAddPoolLiquidityGasFee = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  nativeTokenValue: string,
  assetTokenValue: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string,
  dispatch: Dispatch<PoolAction>
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

  const result = api.tx.assetConversion.addLiquidity(
    firstArg,
    secondArg,
    nativeTokenValue,
    assetTokenValue,
    minNativeTokenValue,
    minAssetTokenValue,
    account.address
  );
  const { partialFee } = await result.paymentInfo(account.address);
  dispatch({
    type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_ADD_LIQUIDITY_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};

export const checkWithdrawPoolLiquidityGasFee = async (
  api: ApiPromise,
  assetTokenId: string,
  account: any,
  lpTokensAmountToBurn: string,
  minNativeTokenValue: string,
  minAssetTokenValue: string,
  dispatch: Dispatch<PoolAction>
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

  const result = api.tx.assetConversion.removeLiquidity(
    firstArg,
    secondArg,
    lpTokensAmountToBurn,
    minNativeTokenValue,
    minAssetTokenValue,
    account.address
  );

  const { partialFee } = await result.paymentInfo(account.address);
  dispatch({
    type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE,
    payload: `transaction will have a weight of ${partialFee.toHuman()} fees`,
  });
  dispatch({
    type: ActionType.SET_ADD_LIQUIDITY_GAS_FEE,
    payload: partialFee.toHuman(),
  });
};
