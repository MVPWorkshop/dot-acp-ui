import { SwapAction, SwapState } from "./interface";
import { ActionType } from "../../app/types/enum";

export const initialSwapState: SwapState = {
  swapFinalized: false,
  swapGasFeesMessage: "",
  swapGasFee: "",
  swapLoading: false,
};

export const swapReducer = (state: SwapState, action: SwapAction): SwapState => {
  switch (action.type) {
    case ActionType.SET_SWAP_FINALIZED:
      return { ...state, swapFinalized: action.payload };
    case ActionType.SET_SWAP_GAS_FEES_MESSAGE:
      return { ...state, swapGasFeesMessage: action.payload };
    case ActionType.SET_SWAP_GAS_FEE:
      return { ...state, swapGasFee: action.payload };
    case ActionType.SET_SWAP_LOADING:
      return { ...state, swapLoading: action.payload };
    default:
      return state;
  }
};
