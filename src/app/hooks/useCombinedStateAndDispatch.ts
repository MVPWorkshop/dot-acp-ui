import { WalletAction, WalletState } from "../../store/wallet/interface";
import { PoolAction, PoolsState } from "../../store/pools/interface";
import { Dispatch } from "react";

const useCombinedStateAndDispatch = (
  walletState: WalletState,
  poolsState: PoolsState,
  dispatchWallet: Dispatch<WalletAction>,
  dispatchPools: Dispatch<PoolAction>
) => {
  const combinedState = { ...walletState, ...poolsState };

  const combinedDispatch = (action: WalletAction | PoolAction) => {
    dispatchWallet(action as WalletAction);
    dispatchPools(action as PoolAction);
  };

  return { combinedState, combinedDispatch };
};

export default useCombinedStateAndDispatch;
