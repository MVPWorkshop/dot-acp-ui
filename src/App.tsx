import { FC, useEffect, useReducer } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useCombinedStateAndDispatch from "./app/hooks/useCombinedStateAndDispatch";
import { initialPoolsState, initialWalletState, poolsReducer, walletReducer } from "./store";
import { setupPolkadotApi } from "./services/polkadotWalletServices";
import { ActionType } from "./app/types/enum";
import { getAllPools } from "./services/poolServices";
import dotAcpToast from "./app/util/toast";

const App: FC = () => {
  const [walletState, dispatchWallet] = useReducer(walletReducer, initialWalletState);
  const [poolsState, dispatchPools] = useReducer(poolsReducer, initialPoolsState);

  const { combinedDispatch, combinedState } = useCombinedStateAndDispatch(
    walletState,
    poolsState,
    dispatchWallet,
    dispatchPools
  );

  const callApiSetup = async () => {
    const { combinedDispatch } = useCombinedStateAndDispatch(walletState, poolsState, dispatchWallet, dispatchPools);
    try {
      const polkaApi = await setupPolkadotApi();
      combinedDispatch({ type: ActionType.SET_API, payload: polkaApi });
      const pools = await getAllPools(polkaApi);

      if (pools) {
        combinedDispatch({ type: ActionType.SET_POOLS, payload: pools });
      }
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
