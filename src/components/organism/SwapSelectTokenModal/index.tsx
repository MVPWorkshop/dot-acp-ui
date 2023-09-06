import { FC } from "react";
import { ReactComponent as DotToken } from "../../../assets/img/dot-token.svg";
// import { useAppContext } from "../../../stateProvider";
import Modal from "../../atom/Modal";

type TokenProps = {
  tokenSymbol: string;
  tokenId: string;
  decimals: string;
  tokenBalance: string;
};
interface SelectTokenPayload {
  id: string;
  assetSymbol: string;
  decimals: string;
  assetTokenBalance: string;
}
interface SwapSelectTokenModalProps {
  // selectedTokenA: TokenProps;
  // selectedTokenB: TokenProps;
  open: boolean;
  title: string;
  tokensData: any;
  onClose: () => void;
  onSelect: (tokenData: TokenProps) => void;
}

const SwapSelectTokenModal: FC<SwapSelectTokenModalProps> = ({
  // selectedTokenA,
  // selectedTokenB,
  open,
  title,
  tokensData,
  onClose,
  onSelect,
}) => {
  // const { state } = useAppContext();
  // const { tokenBalances } = state;

  const handleSelectToken = (payload: SelectTokenPayload) => {
    const assetTokenData = {
      tokenSymbol: payload.assetSymbol,
      tokenId: payload.id,
      decimals: payload.decimals,
      tokenBalance: payload.assetTokenBalance,
    };
    onSelect(assetTokenData);
    onClose();
  };

  // console.log(tokensData)

  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div className="max-h-[504px] overflow-y-auto">
        {/* {selectedTokenA?.tokenSymbol === (tokenBalances?.tokenSymbol as string) ||
          selectedTokenB?.tokenSymbol === (tokenBalances?.tokenSymbol as string) ? null : (
            <div className="group flex min-w-[498px] flex-col hover:rounded-md hover:bg-purple-800">
              <button
                className="flex items-center gap-3 px-4 py-3"
                onClick={() =>
                  handleSelectToken(
                    {
                    id: "",
                    assetSymbol: tokenBalances?.tokenSymbol as string,
                    decimals: tokenBalances?.tokenDecimals as string,
                    assetTokenBalance: tokenBalances?.balance as string
                    })
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
          )} */}

        {tokensData?.map((item: any, index: number) => (
          <div key={index} className="group flex min-w-[498px] flex-col hover:rounded-md hover:bg-purple-800">
            <button
              className="flex items-center gap-3 px-4 py-3"
              onClick={() =>
                handleSelectToken({
                  id: item.tokenId,
                  assetSymbol: item.assetTokenMetadata.symbol,
                  decimals: item.assetTokenMetadata.decimals,
                  assetTokenBalance: item.tokenAsset.balance,
                })
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
  );
};

export default SwapSelectTokenModal;
