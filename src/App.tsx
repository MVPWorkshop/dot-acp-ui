import { FC, useEffect, useReducer } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { setupPolkadotApi } from "./services/polkadotWalletServices";
import { reducer, initialState } from "./state";
import dotAcpToast from "./helper/toast";
import { AppStateProvider } from "./stateProvider";

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const callApiSetup = async () => {
    try {
      const polkaApi = await setupPolkadotApi();
      dispatch({ type: "SET_API", payload: polkaApi });
    } catch (error) {
      dotAcpToast.error(`Error setting up Polkadot API: ${error}`);
    }
  };

  useEffect(() => {
    callApiSetup();
  }, []);

  return (
    <div className="">
      <AppStateProvider state={state} dispatch={dispatch}>
        <RouterProvider router={router} />
      </AppStateProvider>
    </div>
  );
};

export default App;
