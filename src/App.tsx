import { FC, useEffect, useReducer } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { setupPolkadotApi } from "./services/polkadotWalletServices";
import { getAllPools } from "./services/poolsServices";
import { walletReducer, initialWalletState, poolsReducer, initialPoolsState } from "./state";
import dotAcpToast from "./helper/toast";
import { AppStateProvider } from "./stateProvider";

const App: FC = () => {
  const [walletState, dispatchWallet] = useReducer(walletReducer, initialWalletState);
  const [poolsState, dispatchPools] = useReducer(poolsReducer, initialPoolsState);

  const callApiSetup = async () => {
    try {
      const polkaApi = await setupPolkadotApi();
      dispatchWallet({ type: "SET_API", payload: polkaApi });
      const pools = await getAllPools(polkaApi);
      dispatchPools({ type: "SET_POOLS", payload: pools });
    } catch (error) {
      dotAcpToast.error(`Error setting up Polkadot API: ${error}`);
    }
  };

  useEffect(() => {
    callApiSetup();
  }, []);

  return (
    <AppStateProvider
      walletState={walletState}
      dispatchWallet={dispatchWallet}
      poolsState={poolsState}
      dispatchPools={dispatchPools}
    >
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
