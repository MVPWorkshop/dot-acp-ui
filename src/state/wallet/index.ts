import { AppState, Action } from "./interface";

export const initialState: AppState = {
  api: null,
  accounts: [],
  selectedAccount: null,
  tokenBalances: null,
};

export const reducer = (state: AppState, action: Action): AppState => {
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
