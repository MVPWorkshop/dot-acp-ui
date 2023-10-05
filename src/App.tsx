import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import { connectWalletAndFetchBalance } from "./services/polkadotWalletServices";
import LocalStorage from "./app/util/localStorage";
import { createPoolCardsArray } from "./services/poolServices";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api, pools, selectedAccount } = state;

  const walletConnected = LocalStorage.get("wallet-connected");

  const updatePoolsCards = async () => {
    if (api && selectedAccount && pools) {
      await createPoolCardsArray(api, dispatch, pools, selectedAccount);
    } else if (api && pools) {
      await createPoolCardsArray(api, dispatch, pools);
    }
  };

  useEffect(() => {
    if (walletConnected && api) {
      connectWalletAndFetchBalance(dispatch, api, walletConnected);
    }
  }, [api]);

  useEffect(() => {
    updatePoolsCards();
  }, [pools, selectedAccount]);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
