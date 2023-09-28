import { SwapAction, SwapState } from "./interface";
import { ActionType } from "../../app/types/enum";

export const initialSwapState: SwapState = {
  swapFinalized: false,
  swapLoading: false,
};

export const swapReducer = (state: SwapState, action: SwapAction): SwapState => {
  switch (action.type) {
    case ActionType.SET_SWAP_FINALIZED:
      return { ...state, swapFinalized: action.payload };
    case ActionType.SET_SWAP_LOADING:
      return { ...state, swapLoading: action.payload };
    default:
      return state;
  }
};
