import { FC } from "react";
import { ReactComponent as ArrowLeft } from "../../../assets/img/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/img/arrow-right.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import Modal from "../../atom/Modal";

interface SwapAndPoolSuccessModalProps {
  open: boolean;
  contentTitle: string;
  tokenA: {
    value: number;
    symbol: string;
    icon: React.ReactNode;
  };
  tokenB: {
    value: number;
    symbol: string;
    icon: React.ReactNode;
  };
  actionLabel: string;
  onClose: () => void;
}

const SwapAndPoolSuccessModal: FC<SwapAndPoolSuccessModalProps> = ({
  open,
  contentTitle,
  actionLabel,
  tokenA,
  tokenB,
  onClose,
}) => {
  return (
    <div>
      <Modal isOpen={open} onClose={onClose}>
        <div className="flex min-w-[427px] flex-col">
          <div className="font-unbounded-variable text-heading-6">{contentTitle}</div>
          <div className="my-8 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 font-unbounded-variable">
              {tokenA.icon} {tokenA.symbol}
              <ArrowLeft />
              <ArrowRight />
              {tokenB.symbol} {tokenB.icon}
            </div>
            <div className="flex w-full justify-center text-text-color-label-light">
              <div>{actionLabel}</div>
            </div>
            <div className="flex items-center justify-center gap-2 font-unbounded-variable text-medium">
              <DotToken /> {tokenA.value} {tokenA.symbol} <ArrowRight /> <DotToken /> {tokenB.value} {tokenB.symbol}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SwapAndPoolSuccessModal;
