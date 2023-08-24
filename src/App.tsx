import { FC } from "react";
import { ReactComponent as Logo } from "./assets/img/logo.svg";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";

const App: FC = () => {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <Logo className="w-48" />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
