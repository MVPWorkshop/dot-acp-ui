import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../atom/Button/index.tsx";
import dotAcpToast from "../../../helper/toast";
import { useAppContext } from "../../../stateProvider";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import { ReactComponent as AccountImage } from "../../../assets/img/account-image-icon.svg";
import { handleConnection } from "../../../services/polkadotWalletServices";

const HeaderTopNav = () => {
  const { state, dispatch } = useAppContext();
  const { api, selectedAccount } = state;
  const [activeLink, setActiveLink] = useState<string | null>("swap");

  const connectWallet = async () => {
    try {
      await handleConnection(dispatch, api);
    } catch (error) {
      dotAcpToast.error(`Error connecting: ${error}`);
    }
  };

  const reduceAddress = (address: string | undefined, lengthLeft: number, lengthRight: number) => {
    if (address) {
      const addressLeftPart = address.substring(0, lengthLeft);
      const addressRightPart = address.substring(48 - lengthRight, 48);
      return `${addressLeftPart}...${addressRightPart}`;
    }
    return "Not connected";
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
        {!selectedAccount?.address ? (
          <Button onClick={connectWallet} variant="primary" size="large">
            Connect Wallet
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-center gap-[26px]">
              <div className="flex flex-col text-text-color-body-light">
                <div className="font-[500]">{selectedAccount?.meta.name || "Account"}</div>
                <div className="text-small">{reduceAddress(selectedAccount?.address, 6, 6)}</div>
              </div>
              <div>
                <AccountImage />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default HeaderTopNav;
