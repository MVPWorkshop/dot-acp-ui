import HomePage from "../../pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import PoolsPage from "../../pages/PoolsPage";
import SwapPage from "../../pages/SwapPage";
import AddLiquidityPage from "../../pages/AddLiquidityPage";
import { HOME_ROUTE, POOLS_ROUTE, SWAP_ROUTE, ADD_LIQUIDITY } from "./routes";
import MainLayout from "../../layout/MainLayout.tsx";
import NotFoundPage from "../../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: HOME_ROUTE,
        element: <HomePage />,
      },
      {
        path: POOLS_ROUTE,
        children: [
          {
            element: <PoolsPage />,
            index: true,
          },
          {
            path: ADD_LIQUIDITY,
            element: <AddLiquidityPage />,
            index: true,
          },
        ],
      },
      {
        path: SWAP_ROUTE,
        element: <SwapPage />,
      },
    ],
  },
]);

export default router;
