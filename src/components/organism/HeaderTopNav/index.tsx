import classNames from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as AccountImage } from "../../../assets/img/account-image-icon.svg";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import { ButtonVariants } from "../../../global/enum.ts";
import { reduceAddress } from "../../../helper";
import dotAcpToast from "../../../helper/toast";
import { handleConnection } from "../../../services/polkadotWalletServices";
import { useAppContext } from "../../../stateProvider";
import Button from "../../atom/Button/index.tsx";

const HeaderTopNav = () => {
  const { state, dispatch } = useAppContext();
  const { api, selectedAccount } = state;
  const location = useLocation();

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
          className={classNames("font-unbounded-variable tracking-[.96px]", {
            "text-text-color-header-light": location.pathname.includes(SWAP_ROUTE),
          })}
        >
          Swap
        </NavLink>
        <NavLink
          to={POOLS_ROUTE}
          className={classNames("font-unbounded-variable tracking-[.96px]", {
            "text-text-color-header-light": location.pathname.includes(POOLS_ROUTE),
          })}
        >
          Pool
        </NavLink>
      </div>
      <div>
        {!selectedAccount?.address ? (
          <Button onClick={connectWallet} variant={ButtonVariants.btnPrimaryPinkLg}>
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
