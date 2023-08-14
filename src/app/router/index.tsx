import HomePage from "../../pages/HomePage";
import {createBrowserRouter} from "react-router-dom";
import PoolsPage from "../../pages/PoolsPage";
import SwapPage from "../../pages/SwapPage";
import {HOME_ROUTE, POOLS_ROUTE, SWAP_ROUTE} from "./routes";
import MainLayout from "../../layout/MainLayout.tsx";
import NotFoundPage from "../../pages/NotFoundPage";

const router = createBrowserRouter([
    {
        element: <MainLayout/>,
        errorElement: <NotFoundPage/>,
        children: [
            {
                path: HOME_ROUTE,
                element: <HomePage/>,
            },
            {
                path: POOLS_ROUTE,
                element: <PoolsPage/>,
            },
            {
                path: SWAP_ROUTE,
                element: <SwapPage/>,
            },
        ]
    }
]);

export default router;
