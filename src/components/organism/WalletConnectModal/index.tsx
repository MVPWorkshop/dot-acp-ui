import Button from "../../atom/Button";
import Modal from "../../atom/Modal";
import { useAppContext } from "../../../state";
import { InjectedExtension } from "@polkadot/extension-inject/types";

interface WalletConnectModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onClick: () => void;
}

const WalletConnectModal = ({ open, title, onClose, onClick }: WalletConnectModalProps) => {
  const { state } = useAppContext();
  const { extensions } = state;
  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div className="flex min-w-[450px] flex-col gap-5 p-4">
        {extensions.map((wallet: InjectedExtension, index: any) => (
          <div key={index} className="flex gap-5">
            <span className="flex basis-3/4 items-center">{wallet.name}</span>
            <div className="flex basis-2/4 items-center">
              <Button className="btn-secondary-white" onClick={onClick}>
                Continue
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
