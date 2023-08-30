import { WalletState, WalletAction } from "./interface";

export const initialWalletState: WalletState = {
  api: null,
  accounts: [],
  selectedAccount: null,
  tokenBalances: null,
};

export const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case "SET_API":
      return { ...state, api: action.payload };
    case "SET_ACCOUNTS":
      return { ...state, accounts: action.payload };
    case "SET_SELECTED_ACCOUNT":
      return { ...state, selectedAccount: action.payload };
    case "SET_TOKEN_BALANCES":
      return { ...state, tokenBalances: action.payload };
    default:
      return state;
  }
};
