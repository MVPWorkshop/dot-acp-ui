import { FC, useEffect, useReducer } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { ActionType } from "./global/enum";
import dotAcpToast from "./helper/toast";
import { setupPolkadotApi } from "./services/polkadotWalletServices";
import { getAllPools } from "./services/poolServices";
import { initialPoolsState, initialWalletState, poolsReducer, walletReducer } from "./state";
import { PoolAction } from "./state/pools/interface";
import { WalletAction } from "./state/wallet/interface";
import { AppStateProvider } from "./stateProvider";

const App: FC = () => {
  const [walletState, dispatchWallet] = useReducer(walletReducer, initialWalletState);
  const [poolsState, dispatchPools] = useReducer(poolsReducer, initialPoolsState);

  const combinedState = { ...walletState, ...poolsState };

  const combinedDispatch = (action: WalletAction | PoolAction) => {
    dispatchWallet(action as WalletAction);
    dispatchPools(action as PoolAction);
  };

  const callApiSetup = async () => {
    try {
      const polkaApi = await setupPolkadotApi();
      combinedDispatch({ type: ActionType.SET_API, payload: polkaApi });
      const pools = await getAllPools(polkaApi);
      combinedDispatch({ type: ActionType.SET_POOLS, payload: pools });
    } catch (error) {
      dotAcpToast.error(`Error setting up Polkadot API: ${error}`);
    }
  };

  useEffect(() => {
    callApiSetup();
  }, []);

  return (
    <AppStateProvider state={combinedState} dispatch={combinedDispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
