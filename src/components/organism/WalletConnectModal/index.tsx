import Button from "../../atom/Button";
import Modal from "../../atom/Modal";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import { ReactComponent as RandomTokenIcon } from "../../../assets/img/random-token-icon.svg";
import { ReactComponent as PolkadotWalletLogo } from "../../../assets/img/polkadot-wallet-logo.svg";
import TalismanWalletLogo from "../../../assets/img/talisman-wallet-logo.jpeg";
import { useState } from "react";
import { WalletConnectSteps } from "../../../app/types/enum";
import { ModalStepProps } from "../../../app/types";
import { t } from "i18next";

interface WalletConnectModalProps {
  open: boolean;
  title: string;
  modalStep: ModalStepProps;
  extensions: InjectedExtension[];
  accounts: InjectedAccountWithMeta[];
  setModalStep: (step: ModalStepProps) => void;
  onClose: () => void;
  onBack?: () => void | undefined;
  finalizeConnection: (account: InjectedAccountWithMeta) => void;
}

const WalletConnectModal = ({
  open,
  title,
  modalStep,
  extensions,
  accounts,
  onClose,
  onBack,
  setModalStep,
  finalizeConnection,
}: WalletConnectModalProps) => {
  const [walletAddresses, setWalletAddresses] = useState<InjectedAccountWithMeta[]>([]);

  const handleContinueClick = (walletName: any) => {
    setModalStep({ step: WalletConnectSteps.stepAddresses });

    const addresses = accounts.filter((account: InjectedAccountWithMeta) => {
      return account.meta.source === walletName;
    });

    if (addresses) {
      setWalletAddresses(addresses);
    }
  };

  const getWalletIcon = (walletName: string) => {
    if (walletName === "polkadot-js") {
      return <PolkadotWalletLogo width={36} height={36} />;
    }
    if (walletName === "talisman") {
      return <img src={TalismanWalletLogo} style={{ borderRadius: 6, width: 36, height: 36 }} alt="talisman" />;
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={title} onBack={onBack}>
      <div className="flex min-w-[450px] flex-col gap-5 p-4">
        {modalStep.step === WalletConnectSteps.stepExtensions ? (
          extensions.length === 0 ? (
            <div className="p-3">{t("wallet.noWalletFound")}</div>
          ) : (
            extensions.map((wallet: InjectedExtension, index: any) => {
              return (
                <div key={index} className="flex cursor-pointer items-center gap-5">
                  <div className="flex basis-16">{getWalletIcon(wallet.name)}</div>
                  <span className="flex basis-full items-center">{wallet.name}</span>
                  <div className="flex basis-24 items-center">
                    <Button className="btn-secondary-white" onClick={() => handleContinueClick(wallet.name)}>
                      Continue
                    </Button>
                  </div>
                </div>
              );
            })
          )
        ) : null}
        {modalStep.step === WalletConnectSteps.stepAddresses
          ? walletAddresses?.map((address: InjectedAccountWithMeta, index: any) => {
              return (
                <div key={index} className="flex cursor-pointer flex-col rounded-lg bg-purple-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <RandomTokenIcon />
                    <button className="flex flex-col items-start" onClick={() => finalizeConnection(address)}>
                      <div className="text-base font-medium text-gray-300">{address.meta.name}</div>
                      <div className="text-xs font-normal text-gray-300">{address.address}</div>
                    </button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
