import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AppStateProvider } from "./state";
import useStateAndDispatch from "./app/hooks/useStateAndDispatch";

const App: FC = () => {
  const { dispatch, state } = useStateAndDispatch();

  return (
    <AppStateProvider state={state} dispatch={dispatch}>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
};

export default App;
