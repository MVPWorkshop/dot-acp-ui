import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../atom/Button/index.tsx";
import dotAcpToast from "../../../helper/toast";
import { useAppContext } from "../../../stateProvider";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import { handleConnection } from "../../../services/polkadotWalletServices";

const HeaderTopNav = () => {
  const { state, dispatch } = useAppContext();
  const { api } = state;
  const [activeLink, setActiveLink] = useState<string | null>("swap");

  const connectWallet = async () => {
    try {
      await handleConnection(dispatch, api);
    } catch (error) {
      dotAcpToast.error(`Error connecting: ${error}`);
    }
  };

  return (
    <nav className="flex h-[73px] items-center justify-between px-[23px]">
      <div className="pr-[140px]">
        <Logo className="" />
      </div>
      <div className="flex gap-16 text-text-color-label-light">
        <NavLink
          to={SWAP_ROUTE}
          className={`font-unbounded-variable tracking-[.96px] ${
            activeLink === "swap" ? "text-text-color-header-light" : ""
          }`}
          onClick={() => setActiveLink("swap")}
        >
          Swap
        </NavLink>
        <NavLink
          to={POOLS_ROUTE}
          className={`font-unbounded-variable tracking-[.96px] ${
            activeLink === "pools" ? "text-text-color-header-light" : ""
          }`}
          onClick={() => setActiveLink("pools")}
        >
          Pool
        </NavLink>
      </div>
      <div>
        <Button onClick={connectWallet} variant="primary" size="large">
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
};

export default HeaderTopNav;
