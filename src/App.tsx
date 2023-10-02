import { FC, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";
import { handleConnection } from "./services/polkadotWalletServices";
import LocalStorage from "./app/util/localStorage";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();
  const { api } = state;

  const isWalletConnected = LocalStorage.get("wallet-connected");

  useEffect(() => {
    if (isWalletConnected) {
      handleConnection(dispatch, api);
    }
  }, []);

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
