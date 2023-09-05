import { FC, createContext, Dispatch, useContext, ReactNode } from "react";
import { WalletState, WalletAction } from "../store/wallet/interface";
import { PoolsState, PoolAction } from "../store/pools/interface";

interface AppContextType {
  state: WalletState & PoolsState;
  dispatch: Dispatch<WalletAction | PoolAction>;
}

interface AppStateProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: FC<AppStateProviderProps & AppContextType> = (props) => {
  const { children, state, dispatch } = props;

  if (!children) {
    throw new Error("AppStateProvider must have children");
  }

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
