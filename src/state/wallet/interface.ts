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

export type Action =
  | { type: "SET_API"; payload: ApiPromise }
  | { type: "SET_ACCOUNTS"; payload: InjectedAccountWithMeta[] }
  | { type: "SET_SELECTED_ACCOUNT"; payload: InjectedAccountWithMeta }
  | { type: "SET_TOKEN_BALANCES"; payload: TokenData };