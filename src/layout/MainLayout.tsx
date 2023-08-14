import {Link, Outlet} from "react-router-dom";
import {HOME_ROUTE, POOLS_ROUTE, SWAP_ROUTE} from "../app/router/routes.ts";

const MainLayout = () => {
    return <>
        <nav className="flex gap-5">
            <Link to={HOME_ROUTE}>Home</Link>
            <Link to={SWAP_ROUTE}>Swap</Link>
            <Link to={POOLS_ROUTE}>Pool</Link>
        </nav>

        <Outlet/>
    </>
}

export default MainLayout;
