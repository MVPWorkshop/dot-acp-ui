import { FC, ReactNode, useEffect } from "react";
import { ReactComponent as ModalCloseIcon } from "../../../assets/img/modal-close-icon.svg";

interface ModalProps {
  isOpen: boolean;
  modalHeaderText?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, modalHeaderText }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="z-10 rounded rounded-2xl border border-modalBorderColor bg-white p-[18px]  md:shadow-xl">
        <div className="mb-[6px] flex items-center border-b border-b-modalHeaderBorderColor pb-[8px] pr-[13px] pt-[10px]">
          <div className="flex w-full justify-center font-titillium text-extraLarge font-[600]">{modalHeaderText}</div>
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
