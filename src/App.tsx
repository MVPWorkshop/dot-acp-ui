import type { WalletAccount } from "@talismn/connect-wallets";
import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import router from "./app/router";
import LocalStorage from "./app/util/localStorage";
import { connectWalletAndFetchBalance } from "./services/polkadotWalletServices";
import { createPoolCardsArray } from "./services/poolServices";
import { AppStateProvider } from "./state";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api, pools, selectedAccount, tokenBalances } = state;

  const walletConnected: WalletAccount = LocalStorage.get("wallet-connected");

  useEffect(() => {
    if (walletConnected && api) {
      connectWalletAndFetchBalance(dispatch, api, walletConnected).then();
    }
  }, [api]);

  useEffect(() => {
    const updatePoolsCards = async () => {
      if (api && pools.length && tokenBalances?.tokenDecimals)
        await createPoolCardsArray(api, dispatch, pools, selectedAccount, tokenBalances.tokenDecimals);
    };

    updatePoolsCards().then();
  }, [pools, selectedAccount, tokenBalances]);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
