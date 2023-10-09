import { WalletState, WalletAction } from "./interface";
import { ActionType } from "../../app/types/enum";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export const initialWalletState: WalletState = {
  api: null,
  accounts: [],
  selectedAccount: {} as InjectedAccountWithMeta,
  tokenBalances: null,
  walletConnectLoading: false,
  extensions: [],
};

export const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case ActionType.SET_API:
      return { ...state, api: action.payload };
    case ActionType.SET_ACCOUNTS:
      return { ...state, accounts: action.payload };
    case ActionType.SET_SELECTED_ACCOUNT:
      return { ...state, selectedAccount: action.payload };
    case ActionType.SET_TOKEN_BALANCES:
      return { ...state, tokenBalances: action.payload };
    case ActionType.SET_WALLET_CONNECT_LOADING:
      return { ...state, walletConnectLoading: action.payload };
    case ActionType.SET_WALLET_EXTENSIONS:
      return { ...state, extensions: action.payload };
    default:
      return state;
  }
};
