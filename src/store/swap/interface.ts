import { ActionType } from "../../app/types/enum";

export interface SwapState {
  swapFinalized: boolean;
  swapGasFeesMessage: string;
  swapGasFee: string;
  swapLoading: boolean;
}

export type SwapAction =
  | { type: ActionType.SET_SWAP_FINALIZED; payload: boolean }
  | { type: ActionType.SET_SWAP_GAS_FEES_MESSAGE; payload: string }
  | { type: ActionType.SET_SWAP_GAS_FEE; payload: string }
  | { type: ActionType.SET_SWAP_LOADING; payload: boolean };
