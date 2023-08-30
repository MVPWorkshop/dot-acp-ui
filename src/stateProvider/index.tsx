import { FC, createContext, Dispatch, useContext, ReactNode } from "react";
import { WalletState, WalletAction } from "../state/wallet/interface";
import { PoolsState, PoolAction } from "../state/pools/interface";

interface AppContextType {
  walletState: WalletState;
  dispatchWallet: Dispatch<WalletAction>;
  poolsState: PoolsState;
  dispatchPools: Dispatch<PoolAction>;
}

interface AppStateProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: FC<AppStateProviderProps & AppContextType> = (props) => {
  const { children, walletState, dispatchWallet, poolsState, dispatchPools } = props;

  if (!children) {
    throw new Error("AppStateProvider must have children");
  }

  return (
    <AppContext.Provider value={{ walletState, poolsState, dispatchWallet, dispatchPools }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
