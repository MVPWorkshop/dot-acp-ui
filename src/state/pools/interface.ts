export interface PoolsState {
  pools: any;
  poolCreated: any;
  poolLiquidityAdded: any;
}

export type PoolAction =
  | { type: "SET_POOLS"; payload: any }
  | { type: "SET_POOL_CREATED"; payload: any }
  | { type: "SET_POOL_LIQUIDITY"; payload: any };
