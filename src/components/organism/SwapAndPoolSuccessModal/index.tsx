import { FC } from "react";
import { ReactComponent as ArrowLeft } from "../../../assets/img/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/img/arrow-right.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import Modal from "../../atom/Modal";

interface SwapAndPoolSuccessModalProps {
  open: boolean;
  contentTitle: string;
  tokenAValue: number;
  tokenBValue: number;
  tokenASymbol: string;
  tokenBSymbol: string;
  actionLabel: string;
  tokenAIcon: React.ReactNode;
  tokenBIcon: React.ReactNode;
  onClose: () => void;
}

const SwapAndPoolSuccessModal: FC<SwapAndPoolSuccessModalProps> = ({
  open,
  contentTitle,
  tokenAValue,
  tokenBValue,
  tokenASymbol,
  tokenBSymbol,
  actionLabel,
  tokenAIcon,
  tokenBIcon,
  onClose,
}) => {
  return (
    <div>
      <Modal isOpen={open} onClose={onClose}>
        <div className="flex min-w-[427px] flex-col">
          <div className="font-unbounded-variable text-heading-6">{contentTitle}</div>
          <div className="my-8 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 font-unbounded-variable">
              {tokenAIcon} {tokenASymbol}
              <ArrowLeft />
              <ArrowRight />
              {tokenBSymbol} {tokenBIcon}
            </div>
            <div className="flex w-full justify-center text-text-color-label-light">
              <div>{actionLabel}</div>
            </div>
            <div className="flex items-center justify-center gap-2 font-unbounded-variable text-medium">
              <DotToken /> {tokenAValue} {tokenASymbol} <ArrowRight /> <DotToken /> {tokenBValue} {tokenBSymbol}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SwapAndPoolSuccessModal;
