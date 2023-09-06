import { WalletAction } from "../../store/wallet/interface";
import { PoolAction } from "../../store/pools/interface";
import { useEffect, useReducer } from "react";
import { initialPoolsState, initialWalletState, poolsReducer, walletReducer } from "../../store";
import { setupPolkadotApi } from "../../services/polkadotWalletServices";
import { ActionType } from "../types/enum";
import { getAllPools } from "../../services/poolServices";
import dotAcpToast from "../util/toast";

const useStateAndDispatch = () => {
  const [walletState, dispatchWallet] = useReducer(walletReducer, initialWalletState);
  const [poolsState, dispatchPools] = useReducer(poolsReducer, initialPoolsState);

  const state = { ...walletState, ...poolsState };

  const dispatch = (action: WalletAction | PoolAction) => {
    dispatchWallet(action as WalletAction);
    dispatchPools(action as PoolAction);
  };

  useEffect(() => {
    const callApiSetup = async () => {
      try {
        const polkaApi = await setupPolkadotApi();
        dispatch({ type: ActionType.SET_API, payload: polkaApi });
        const pools = await getAllPools(polkaApi);

        if (pools) {
          dispatch({ type: ActionType.SET_POOLS, payload: pools });
        }
      } catch (error) {
        dotAcpToast.error(`Error setting up Polkadot API: ${error}`);
      }
    };

    callApiSetup();
  }, []);

  return { state, dispatch };
};

export default useStateAndDispatch;
