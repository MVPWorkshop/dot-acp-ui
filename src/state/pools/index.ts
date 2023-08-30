import { PoolsState, PoolAction } from "./interface";

export const initialPoolsState: PoolsState = {
  pools: null,
  poolCreated: null,
  poolLiquidityAdded: null,
};

export const poolsReducer = (state: PoolsState, action: PoolAction): PoolsState => {
  switch (action.type) {
    case "SET_POOLS":
      return { ...state, pools: action.payload };
    case "SET_POOL_CREATED":
      return { ...state, poolCreated: action.payload };
    case "SET_POOL_LIQUIDITY":
      return { ...state, poolLiquidityAdded: action.payload };

    default:
      return state;
  }
};
