import { FC } from "react";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
import { useAppContext } from "../../../stateProvider";
import Modal from "../../atom/Modal";

type TokenProps = {
  tokenSymbol: string;
  tokenId: string;
  decimals: string;
  tokenBalance: string;
};

interface SwapSelectTokenModalProps {
  setSelectedToken: (tokenData: TokenProps) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedTokenA: TokenProps;
  selectedTokenB: TokenProps;
  isModalOpen: boolean;
  title: string;
}

const SwapSelectTokenModal: FC<SwapSelectTokenModalProps> = ({
  setSelectedToken,
  setIsModalOpen,
  selectedTokenA,
  selectedTokenB,
  isModalOpen,
  title,
}) => {
  const { state } = useAppContext();
  const { tokenBalances, pools } = state;

  const poolsAssetTokenIds = pools?.map((pool: any) => {
    if (pool[0][1].interior?.X2) {
      const assetTokenIds = pool[0][1].interior.X2[1].GeneralIndex.replace(/[, ]/g, "").toString();
      return assetTokenIds;
    }
  });

  const poolFilteredAssetTokens = tokenBalances?.assets?.filter((item: any) =>
    poolsAssetTokenIds.includes(item.tokenId)
  );

  const selectedFilteredAssetTokens = poolFilteredAssetTokens?.filter((item: any) => {
    return item.tokenId !== selectedTokenA?.tokenId && item.tokenId !== selectedTokenB?.tokenId;
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectToken = (id: string, assetSymbol: string, decimals: string, assetTokenBalance: string) => {
    const assetTokenData = {
      tokenSymbol: assetSymbol,
      tokenId: id,
      decimals: decimals,
      tokenBalance: assetTokenBalance,
    };
    setSelectedToken(assetTokenData);
    closeModal();
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={title}>
        <div className="max-h-[504px] overflow-y-auto">
          {selectedTokenA?.tokenSymbol === (tokenBalances?.tokenSymbol as string) ||
          selectedTokenB?.tokenSymbol === (tokenBalances?.tokenSymbol as string) ? null : (
            <div className="group flex min-w-[498px] flex-col hover:rounded-md hover:bg-purple-800">
              <button
                className="flex items-center gap-3 px-4 py-3"
                onClick={() =>
                  handleSelectToken(
                    "",
                    tokenBalances?.tokenSymbol as string,
                    tokenBalances?.tokenDecimals as string,
                    tokenBalances?.balance as string
                  )
                }
              >
                <div>
                  <DotToken width={36} height={36} />
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-text-color-header-light group-hover:text-white">
                    {tokenBalances?.tokenSymbol as string}
                  </div>
                  <div className="text-small text-text-color-body-light group-hover:text-white">Native Token</div>
                </div>
              </button>
            </div>
          )}

          {selectedFilteredAssetTokens?.map((item: any, index: number) => (
            <div key={index} className="group flex min-w-[498px] flex-col hover:rounded-md hover:bg-purple-800">
              <button
                className="flex items-center gap-3 px-4 py-3"
                onClick={() =>
                  handleSelectToken(
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

export default SwapSelectTokenModal;
