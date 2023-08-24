import { FC, ReactNode, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as ModalCloseIcon } from "../../../assets/img/modal-close-icon.svg";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative z-10 transform overflow-hidden rounded rounded-2xl border border-modal-border-color bg-white p-[18px] shadow-modal-box-shadow">
                <div className="mb-[6px] flex items-center border-b border-b-modal-header-border-color pb-[8px] pr-[24px] pt-[10px]">
                  <div className="flex w-full justify-center font-unbounded-variable text-heading-6 leading-[120%]">
                    {title}
                  </div>
                  <div className="flex cursor-pointer justify-end" onClick={onClose}>
                    <ModalCloseIcon />
                  </div>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
