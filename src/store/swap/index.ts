import { SwapAction, SwapState } from "./interface";
import { ActionType } from "../../app/types/enum";

export const initialSwapState: SwapState = {
  swapFinalized: false,
};

export const swapReducer = (state: SwapState, action: SwapAction): SwapState => {
  switch (action.type) {
    case ActionType.SET_SWAP_FINALIZED:
      return { ...state, swapFinalized: action.payload };
    default:
      return state;
  }
};
