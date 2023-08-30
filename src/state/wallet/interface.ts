import type { AnyJson } from "@polkadot/types/types/codec";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ApiPromise } from "@polkadot/api";
import { ActionType } from "../../global/enum";

interface TokenData {
  balance: AnyJson;
  ss58Format: AnyJson;
  tokenDecimals: AnyJson;
  tokenSymbol: AnyJson;
  assets: any;
}

export interface WalletState {
  api: ApiPromise | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  tokenBalances: TokenData | null;
}

// export type WalletAction =
//   | { type: ActionType.SET_API; payload: ApiPromise }
//   | { type: ActionType.SET_ACCOUNTS; payload: InjectedAccountWithMeta[] }
//   | { type: ActionType.SET_SELECTED_ACCOUNT; payload: InjectedAccountWithMeta }
//   | { type: ActionType.SET_TOKEN_BALANCES; payload: TokenData };

export type WalletAction = {
  type: ActionType;
  payload: ApiPromise | InjectedAccountWithMeta[] | InjectedAccountWithMeta | TokenData | null;
};
