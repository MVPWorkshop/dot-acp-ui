import { ActionType } from "../../app/types/enum";

export interface SwapState {
  swapFinalized: boolean;
}

export type SwapAction = { type: ActionType.SET_SWAP_FINALIZED; payload: boolean };
