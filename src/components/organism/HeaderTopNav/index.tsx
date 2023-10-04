import classNames from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import { POOLS_ROUTE, SWAP_ROUTE } from "../../../app/router/routes.ts";
import { ReactComponent as AccountImage } from "../../../assets/img/account-image-icon.svg";
import { ReactComponent as Logo } from "../../../assets/img/logo-icon.svg";
import { ActionType, ButtonVariants, WalletConnectSteps } from "../../../app/types/enum.ts";
import { reduceAddress } from "../../../app/util/helper";
import dotAcpToast from "../../../app/util/toast.ts";
import {
  getExtensionsAndAccounts,
  handleConnection,
  handleDisconnect,
  setTokenBalance,
} from "../../../services/polkadotWalletServices";
import { useAppContext } from "../../../state/index.tsx";
import Button from "../../atom/Button/index.tsx";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import { lottieOptions } from "../../../assets/loader/index.tsx";
import Lottie from "react-lottie";
import WalletConnectModal from "../WalletConnectModal/index.tsx";
import LocalStorage from "../../../app/util/localStorage.ts";
import { ModalStepProps } from "../../../app/types/index.ts";
import type { Timeout } from "react-number-format/types/types";

const HeaderTopNav = () => {
  const { state, dispatch } = useAppContext();
  const { walletConnectLoading, api } = state;
  const location = useLocation();

  const [walletAccount, setWalletAccount] = useState<InjectedAccountWithMeta>({} as InjectedAccountWithMeta);
  const [modalStep, setModalStep] = useState<ModalStepProps>({ step: WalletConnectSteps.stepExtensions });
  const [walletConnectOpen, setWalletConnectOpen] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([] as InjectedAccountWithMeta[]);
  const [extensions, setExtensions] = useState<InjectedExtension[]>([] as InjectedExtension[]);

  const walletConnected = LocalStorage.get("wallet-connected");

  const connectWallet = async () => {
    dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: true });
    try {
      setWalletConnectOpen(true);
      const { extensions, accounts } = await getExtensionsAndAccounts();
      if (extensions && accounts) {
        setAccounts(accounts);
        setExtensions(extensions as InjectedExtension[]);
      }
      dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
    } catch (error) {
      dotAcpToast.error(`Error connecting: ${error}`);
      dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
    }
  };

  const finalizeConnection = async (selectedAccount: InjectedAccountWithMeta) => {
    setWalletConnectOpen(false);
    await handleConnection(dispatch);
    await setTokenBalance(dispatch, api, selectedAccount);
  };

  const onBack = () => {
    setModalStep({ step: WalletConnectSteps.stepExtensions });
  };

  const disconnectWallet = () => {
    handleDisconnect(dispatch);
    setWalletAccount({} as InjectedAccountWithMeta);
    setModalStep({ step: WalletConnectSteps.stepExtensions });
  };

  useEffect(() => {
    if (walletConnected) {
      setWalletAccount(walletConnected);
    }
  }, [walletConnected?.address]);

  useEffect(() => {
    let timeout: Timeout;
    if (!walletConnectOpen) {
      timeout = setTimeout(() => setModalStep({ step: WalletConnectSteps.stepExtensions }), 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [walletConnectOpen]);

  return (
    <>
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
            <>
              {walletConnectLoading ? (
                <Button
                  onClick={connectWallet}
                  variant={ButtonVariants.btnPrimaryPinkLg}
                  disabled={walletConnectLoading}
                >
                  <Lottie options={lottieOptions} height={20} width={20} />
                </Button>
              ) : (
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
              )}
            </>
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
      <WalletConnectModal
        title="Connect a Wallet"
        open={walletConnectOpen}
        onClose={() => setWalletConnectOpen(false)}
        onBack={onBack}
        finalizeConnection={finalizeConnection}
        modalStep={modalStep}
        setModalStep={setModalStep}
        extensions={extensions}
        accounts={accounts}
      />
    </>
  );
};

export default HeaderTopNav;
