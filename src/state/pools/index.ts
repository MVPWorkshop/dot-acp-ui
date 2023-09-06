import { PoolsState, PoolAction } from "./interface";
import { ActionType } from "../../global/enum";

export const initialPoolsState: PoolsState = {
  pools: [],
  poolsCards: [],
  poolCreated: false,
  poolLiquidityAdded: null,
  poolAssetTokenData: { tokenSymbol: "", assetTokenId: "", decimals: "" },
  transferGasFeesMessage: "",
  poolGasFee: "",
  addLiquidityGasFee: "",
};

export const poolsReducer = (state: PoolsState, action: PoolAction): PoolsState => {
  switch (action.type) {
    case ActionType.SET_POOLS:
      return { ...state, pools: action.payload };
    case ActionType.SET_POOL_CREATED:
      return { ...state, poolCreated: action.payload };
    case ActionType.SET_POOL_LIQUIDITY:
      return { ...state, poolLiquidityAdded: action.payload };
    case ActionType.SET_POOL_ASSET_TOKEN_DATA:
      return { ...state, poolAssetTokenData: action.payload };
    case ActionType.SET_TRANSFER_GAS_FEES_MESSAGE:
      return { ...state, transferGasFeesMessage: action.payload };
    case ActionType.SET_POOL_GAS_FEE:
      return { ...state, poolGasFee: action.payload };
    case ActionType.SET_ADD_LIQUIDITY_GAS_FEE:
      return { ...state, addLiquidityGasFee: action.payload };
    case ActionType.SET_POOLS_CARDS:
      return { ...state, poolsCards: action.payload };
    default:
      return state;
  }
};
