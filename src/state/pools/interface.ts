import type { AnyJson } from "@polkadot/types/types/codec";
import { ActionType } from "../../global/enum";

export interface PoolsState {
  pools: AnyJson;
  poolCreated: any;
  poolLiquidityAdded: any;
}

export type PoolAction =
  | { type: ActionType.SET_POOLS; payload: AnyJson }
  | { type: ActionType.SET_POOL_CREATED; payload: any }
  | { type: ActionType.SET_POOL_LIQUIDITY; payload: any };
