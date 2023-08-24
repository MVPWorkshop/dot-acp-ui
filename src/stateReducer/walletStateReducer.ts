import type { AnyJson } from "@polkadot/types/types/codec";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ApiPromise } from "@polkadot/api";

interface TokenData {
  balance: AnyJson;
  ss58Format: AnyJson;
  tokenDecimals: AnyJson;
  tokenSymbol: AnyJson;
  assets: any;
}

export interface AppState {
  api: ApiPromise | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  tokenBalances: TokenData | null;
}

type Action =
  | { type: "SET_API"; payload: ApiPromise }
  | { type: "SET_ACCOUNTS"; payload: InjectedAccountWithMeta[] }
  | { type: "SET_SELECTED_ACCOUNT"; payload: InjectedAccountWithMeta }
  | { type: "SET_TOKEN_BALANCES"; payload: TokenData };

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
