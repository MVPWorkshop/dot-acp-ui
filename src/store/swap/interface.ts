import { ActionType } from "../../app/types/enum";

export interface SwapState {
  swapFinalized: boolean;
  swapLoading: boolean;
}

export type SwapAction =
  | { type: ActionType.SET_SWAP_FINALIZED; payload: boolean }
  | { type: ActionType.SET_SWAP_LOADING; payload: boolean };
