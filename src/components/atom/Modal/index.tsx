import { FC, ReactNode } from "react";
import useOnPress from "../../../customHooks/useOnPress";
import { ReactComponent as ModalCloseIcon } from "../../../assets/img/modal-close-icon.svg";

interface ModalProps {
  isOpen: boolean;
  modalHeaderText?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, modalHeaderText }) => {
  useOnPress("Escape", onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="z-10 rounded rounded-2xl border border-modal-border-color bg-white p-[18px]  shadow-modal-box-shadow">
        <div className="mb-[6px] flex items-center border-b border-b-modal-header-border-color pb-[8px] pr-[13px] pt-[10px]">
          <div className="flex w-full justify-center font-unbounded-variable text-modal-header-text leading-[120%]">
            {modalHeaderText}
          </div>
          <div className="flex cursor-pointer justify-end" onClick={onClose}>
            <ModalCloseIcon />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
