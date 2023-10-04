import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import { connectWalletAndFetchBalance } from "./services/polkadotWalletServices";
import LocalStorage from "./app/util/localStorage";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api } = state;

  const walletConnected = LocalStorage.get("wallet-connected");

  useEffect(() => {
    if (walletConnected && api) {
      connectWalletAndFetchBalance(dispatch, api, walletConnected);
    }
  }, [api]);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
