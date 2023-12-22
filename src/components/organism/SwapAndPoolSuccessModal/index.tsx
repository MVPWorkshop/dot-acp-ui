import { FC } from "react";
import useGetNetwork from "../../../app/hooks/useGetNetwork";
import { ReactComponent as ArrowLeft } from "../../../assets/img/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/img/arrow-right.svg";
import { ReactComponent as OpenLinkArrow } from "../../../assets/img/open-link-arrow.svg";
import { useAppContext } from "../../../state";
import Modal from "../../atom/Modal";

interface SwapAndPoolSuccessModalProps {
  open: boolean;
  contentTitle: string;
  tokenA: {
    value?: string | null;
    symbol: string;
    icon: React.ReactNode;
  };
  tokenB: {
    value?: string | null;
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
  const { assethubSubscanUrl, nativeTokenSymbol } = useGetNetwork();
  const { state } = useAppContext();
  const { blockHashFinalized } = state;
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
            <div className="flex w-full justify-center text-gray-200">
              <div>{actionLabel}</div>
            </div>
            <div className="flex items-center justify-center gap-2 font-unbounded-variable text-medium">
              {tokenA.icon} {tokenA.value} {tokenA.symbol} <ArrowRight /> {tokenB.icon} {tokenB.value} {tokenB.symbol}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-1 font-unbounded-variable text-medium underline">
            <a
              href={`${assethubSubscanUrl}/block${nativeTokenSymbol == "WND" ? "s" : ""}/${blockHashFinalized}`}
              target="_blank"
              rel="noreferrer"
            >
              View in block explorer
            </a>
            <OpenLinkArrow />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SwapAndPoolSuccessModal;
