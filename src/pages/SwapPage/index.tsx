import { FC } from "react";
import { toUnit } from "../../services/polkadotWalletServices";
import { useAppContext } from "../../stateProvider";
import SwapTokens from "../../components/organism/SwapTokens";

const SwapPage: FC = () => {
  const { walletState } = useAppContext();
  const { selectedAccount, tokenBalances } = walletState;

  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <h1>Swap</h1>
      <p>Wallet: {selectedAccount?.meta.source}</p>
      <p>Address: {selectedAccount?.address}</p>
      <p>
        Balance: {tokenBalances?.balance ? tokenBalances?.balance.toString() : ""}{" "}
        {tokenBalances?.tokenSymbol ? tokenBalances?.tokenSymbol.toString() : ""}
      </p>
      <p>Assets:</p>
      <div>
        {tokenBalances?.assets?.map((item: any, index: number) => (
          <div key={index}>
            <ul>
              <li>Name: {item.assetTokenMetadata.name}</li>
              <li>
                {toUnit(item.tokenAsset.balance.replace(/[, ]/g, "").toString(), item.assetTokenMetadata.decimals)}{" "}
                {item.assetTokenMetadata.symbol}
              </li>
            </ul>
          </div>
        ))}
      </div>

      <SwapTokens />
    </div>
  );
};
export default SwapPage;
