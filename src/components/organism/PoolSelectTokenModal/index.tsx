import { FC } from "react";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { ActionType } from "../../../global/enum";
import { useAppContext } from "../../../stateProvider";
import Modal from "../../atom/Modal";

type TokenProps = {
  tokenSymbol: string;
  assetTokenId: string;
  decimals: string;
  assetTokenBalance: string;
};
interface PoolSelectTokenModalProps {
  setSelectedTokenB: (tokenData: TokenProps) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  title: string;
}

const PoolSelectTokenModal: FC<PoolSelectTokenModalProps> = ({
  setSelectedTokenB,
  setIsModalOpen,
  isModalOpen,
  title,
}) => {
  const { state, dispatch } = useAppContext();
  const { tokenBalances } = state;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePoolAssetTokeId = (id: string, assetSymbol: string, decimals: string, assetTokenBalance: string) => {
    const assetTokenData = {
      tokenSymbol: assetSymbol,
      assetTokenId: id,
      decimals: decimals,
      assetTokenBalance: assetTokenBalance,
    };
    dispatch({ type: ActionType.SET_POOL_ASSET_TOKEN_DATA, payload: assetTokenData });
    setSelectedTokenB(assetTokenData);
    closeModal();
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={title}>
        <div className="max-h-[504px] overflow-y-auto">
          {tokenBalances?.assets?.map((item: any, index: number) => (
            <div key={index} className="group flex min-w-[498px] flex-col hover:rounded-md hover:bg-purple-800">
              <button
                className="flex items-center gap-3 px-4 py-3"
                onClick={() =>
                  handlePoolAssetTokeId(
                    item.tokenId,
                    item.assetTokenMetadata.symbol,
                    item.assetTokenMetadata.decimals,
                    item.tokenAsset.balance
                  )
                }
              >
                <div>
                  <DotToken width={36} height={36} />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-text-color-header-light group-hover:text-white">
                    {item.assetTokenMetadata.name}
                  </div>
                  <div className="text-small text-text-color-body-light group-hover:text-white">
                    {item.assetTokenMetadata.symbol}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PoolSelectTokenModal;
