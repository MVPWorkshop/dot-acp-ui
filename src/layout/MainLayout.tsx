import { Link, Outlet } from "react-router-dom";
import { POOLS_ROUTE, SWAP_ROUTE } from "../app/router/routes.ts";
import { ReactComponent as Logo } from "../assets/img/logo-icon.svg";

const MainLayout = () => {
  return (
    <>
      <nav className="flex items-center justify-between px-[23px] py-4">
        <div>
          <Logo className="" />
        </div>
        <div className="flex gap-16">
          <Link to={SWAP_ROUTE} className="">
            Swap
          </Link>
          <Link to={POOLS_ROUTE} className="">
            Pool
          </Link>
        </div>
        <div>
          <button>Connect</button>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default MainLayout;
