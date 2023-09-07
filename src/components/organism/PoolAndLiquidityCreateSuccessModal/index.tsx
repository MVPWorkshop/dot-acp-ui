import { FC } from "react";
import { ReactComponent as ArrowLeft } from "../../../assets/img/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/img/arrow-right.svg";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType } from "../../../app/types/enum";
import { getAllPools } from "../../../services/poolServices";
import { useAppContext } from "../../../state";
import Modal from "../../atom/Modal";

interface PoolAndLiquidityCreateSuccessModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  contentTitle: string;
  nativeTokenAmount: number;
  assetTokenAmount: number;
  nativeTokenSymbol: string;
  assetTokenSymbol: string;
}

const PoolAndLiquidityCreateSuccessModal: FC<PoolAndLiquidityCreateSuccessModalProps> = ({
  setIsModalOpen,
  isModalOpen,
  contentTitle,
  nativeTokenAmount,
  assetTokenAmount,
  nativeTokenSymbol,
  assetTokenSymbol,
}) => {
  const { state, dispatch } = useAppContext();
  const { api } = state;

  const closeModal = async () => {
    setIsModalOpen(false);
    dispatch({ type: ActionType.SET_POOL_CREATED, payload: false });
    if (api) await getAllPools(api);
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
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
