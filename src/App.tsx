import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";

const App: FC = () => {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
