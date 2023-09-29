import classNames from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as AccountImage } from "../../../assets/img/account-image-icon.svg";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import { ButtonVariants } from "../../../app/types/enum.ts";
import { reduceAddress } from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast.ts";
import { handleConnection, handleDisconnect } from "../../../services/polkadotWalletServices";
import { useAppContext } from "../../../state/index.tsx";
import Button from "../../atom/Button/index.tsx";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { lottieOptions } from "../../../assets/loader/index.tsx";
import Lottie from "react-lottie";

const HeaderTopNav = () => {
  const { state, dispatch } = useAppContext();
  const { api, walletConnectLoading } = state;
  const location = useLocation();
  const [walletAccount, setWalletAccount] = useState<InjectedAccountWithMeta>({} as InjectedAccountWithMeta);

  const walletConnected = localStorage.getItem("wallet-connected");

  const connectWallet = async () => {
    try {
      await handleConnection(dispatch, api);
    } catch (error) {
      dotAcpToast.error(`Error connecting: ${error}`);
    }
  };

  const disconnectWallet = () => {
    handleDisconnect(dispatch);
    setWalletAccount({} as InjectedAccountWithMeta);
  };

  useEffect(() => {
    if (walletConnected) {
      setWalletAccount(JSON.parse(walletConnected));
    }
  }, [walletConnected]);

  return (
    <nav className="flex h-[73px] items-center justify-between px-[23px]">
      <div className="pr-[140px]">
        <Logo />
      </div>
      <div className="flex gap-16 text-gray-200">
        <NavLink
          to={SWAP_ROUTE}
          className={classNames("font-unbounded-variable tracking-[.96px]", {
            "text-gray-400": location.pathname.includes(SWAP_ROUTE),
          })}
        >
          {t("button.swap")}
        </NavLink>
        <NavLink
          to={POOLS_ROUTE}
          className={classNames("font-unbounded-variable tracking-[.96px]", {
            "text-gray-400": location.pathname.includes(POOLS_ROUTE),
          })}
        >
          {t("button.pool")}
        </NavLink>
      </div>
      <div className="w-[180px]">
        {walletConnected ? (
          <div className="flex items-center justify-center gap-[26px]">
            <div className="flex flex-col text-gray-300">
              <div className="font-[500]">{walletAccount?.meta?.name || "Account"}</div>
              <div className="text-small">{reduceAddress(walletAccount?.address, 6, 6)}</div>
            </div>
            <div>
              <button onClick={() => disconnectWallet()}>
                <AccountImage />
              </button>
            </div>
          </div>
        ) : (
          <Button onClick={connectWallet} variant={ButtonVariants.btnPrimaryPinkLg} disabled={walletConnectLoading}>
            {walletConnectLoading ? (
              <Lottie options={lottieOptions} height={20} width={20} />
            ) : (
              t("button.connectWallet")
            )}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default HeaderTopNav;
