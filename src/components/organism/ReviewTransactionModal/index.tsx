import { FC } from "react";
import Modal from "../../atom/Modal";
import Button from "../../atom/Button";
import { ButtonVariants, InputEditedType } from "../../../app/types/enum";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";

interface SwapSelectTokenModalProps {
  open: boolean;
  title: string;
  youPay: string;
  youReceive: string;
  priceImpact: string;
  tokenValueA?: string;
  tokenValueB?: string;
  tokenSymbolA: string;
  tokenSymbolB: string;
  inputType: string;
  onClose: () => void;
  onConfirmTransaction: () => void;
}

const ReviewTransactionModal: FC<SwapSelectTokenModalProps> = ({
  open,
  title,
  youPay,
  youReceive,
  priceImpact,
  tokenValueA,
  tokenValueB,
  tokenSymbolA,
  tokenSymbolB,
  inputType,
  onClose,
  onConfirmTransaction,
}) => {
  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div className="flex w-[360px] flex-col gap-5">
        <div className="flex flex-col items-start">
          <span className="font-inter text-small text-gray-200">You pay</span>
          <span className="flex w-full items-center justify-between font-unbounded-variable text-heading-4 font-bold text-gray-400">
            {youPay}
            <DotToken />
          </span>
          <span className="font-inter text-medium text-gray-200">$200</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="font-inter text-small text-gray-200">You receive</span>
          <span className="flex w-full items-center justify-between font-unbounded-variable text-heading-4 font-bold text-gray-400">
            {youReceive}
            <DotToken />
          </span>
          <span className="font-inter text-medium text-gray-200">$300</span>
        </div>
        <hr className="mb-0.5 mt-1 w-full border-[0.7px] border-gray-50" />
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span className="font-inter text-medium text-gray-300">Price impact</span>
            <span className="font-inter text-medium text-gray-400">{priceImpact}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-inter text-medium text-gray-300">
              {inputType == InputEditedType.exactIn ? "Expected output" : "Expected input"}
            </span>
            <span className="font-inter text-medium text-gray-400">
              {tokenValueA} {tokenSymbolA}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-inter text-medium text-gray-300">
              {inputType === InputEditedType.exactIn ? "Minimum output" : "Maximum input"}t
            </span>
            <span className="font-inter text-medium text-gray-400">
              {tokenValueB} {tokenSymbolB}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <Button onClick={onConfirmTransaction} variant={ButtonVariants.btnInteractivePink}>
            Confirm Swap
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewTransactionModal;