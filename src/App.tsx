import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import { connectWalletAndFetchBalance } from "./services/polkadotWalletServices";
import LocalStorage from "./app/util/localStorage";
import { createPoolCardsArray } from "./services/poolServices";
import type { WalletAccount } from "@talismn/connect-wallets";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api, pools, selectedAccount } = state;

  const walletConnected: WalletAccount = LocalStorage.get("wallet-connected");

  useEffect(() => {
    if (walletConnected && api) {
      connectWalletAndFetchBalance(dispatch, api, walletConnected);
    }
  }, [api]);

  useEffect(() => {
    const updatePoolsCards = async () => {
      if (api && pools) await createPoolCardsArray(api, dispatch, pools, selectedAccount);
    };

    updatePoolsCards();
  }, [pools, selectedAccount]);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
