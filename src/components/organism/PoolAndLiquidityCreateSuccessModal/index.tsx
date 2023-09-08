import { FC } from "react";
import { ReactComponent as ArrowLeft } from "../../../assets/img/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/img/arrow-right.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import Modal from "../../atom/Modal";

interface PoolAndLiquidityCreateSuccessModalProps {
  open: boolean;
  contentTitle: string;
  nativeTokenAmount: number;
  assetTokenAmount: number;
  nativeTokenSymbol: string;
  assetTokenSymbol: string;
  onClose: () => void;
}

const PoolAndLiquidityCreateSuccessModal: FC<PoolAndLiquidityCreateSuccessModalProps> = ({
  open,
  contentTitle,
  nativeTokenAmount,
  assetTokenAmount,
  nativeTokenSymbol,
  assetTokenSymbol,
  onClose,
}) => {
  return (
    <div>
      <Modal isOpen={open} onClose={onClose}>
        <div className="flex min-w-[427px] flex-col">
          <div className="font-unbounded-variable text-heading-6">{contentTitle}</div>
          <div className="my-8 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 font-unbounded-variable">
              <DotToken /> {assetTokenSymbol}
              <ArrowLeft />
              <ArrowRight />
              {nativeTokenSymbol} <DotToken />
            </div>
            <div className="flex w-full justify-center text-text-color-label-light">
              <div>added</div>
            </div>
            <div className="flex items-center justify-center gap-2 font-unbounded-variable text-medium">
              <DotToken /> {assetTokenAmount} {assetTokenSymbol} <ArrowRight /> <DotToken /> {nativeTokenAmount}{" "}
              {nativeTokenSymbol}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PoolAndLiquidityCreateSuccessModal;
