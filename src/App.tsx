import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import { handleConnection, setTokenBalance } from "./services/polkadotWalletServices";
import LocalStorage from "./app/util/localStorage";
import { ActionType } from "./app/types/enum";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api } = state;

  const isWalletConnected = LocalStorage.get("wallet-connected");

  const connectWalletAndFetchBalance = async () => {
    dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: true });
    await setTokenBalance(dispatch, api, isWalletConnected);
    await handleConnection(dispatch);
    dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
  };

  useEffect(() => {
    if (isWalletConnected && api) {
      connectWalletAndFetchBalance();
    }
  }, [api]);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
