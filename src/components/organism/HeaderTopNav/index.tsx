import { useState } from "react";
import { NavLink } from "react-router-dom";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import Button from "../../atom/Button/index.tsx";

const HeaderTopNav = () => {
  const [activeLink, setActiveLink] = useState<string | null>("swap");
  return (
    <nav className="flex h-[73px] items-center justify-between px-[23px]">
      <div>
        <Logo className="" />
      </div>
      <div className="text-textColor-label-light flex gap-16">
        <NavLink
          to={SWAP_ROUTE}
          className={`font-unbounded-variable tracking-[.96px] ${
            activeLink === "swap" ? "text-textColor-header-light" : ""
          }`}
          onClick={() => setActiveLink("swap")}
        >
          Swap
        </NavLink>
        <NavLink
          to={POOLS_ROUTE}
          className={`font-unbounded-variable tracking-[.96px] ${
            activeLink === "pools" ? "text-textColor-header-light" : ""
          }`}
          onClick={() => setActiveLink("pools")}
        >
          Pool
        </NavLink>
      </div>
      <div>
        <Button onClick={() => console.log("click")} variant="primary" size="large">
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
};

export default HeaderTopNav;
