import type { AnyJson } from "@polkadot/types/types/codec";
import { ActionType } from "../../app/types/enum";
import { PoolCardProps, PoolsTokenMetadata } from "../../app/types";

export interface PoolsState {
  pools: AnyJson[];
  poolsCards: PoolCardProps[];
  poolCardSelected: PoolCardProps | null;
  successModalOpen: boolean;
  poolLiquidityAdded: any;
  poolAssetTokenData: { tokenSymbol: string; assetTokenId: string; decimals: string };
  transferGasFeesMessage: string;
  poolGasFee: string;
  addLiquidityGasFee: string;
  poolsTokenMetadata: PoolsTokenMetadata[];
}

export type PoolAction =
  | { type: ActionType.SET_POOLS; payload: AnyJson[] }
  | { type: ActionType.SET_SUCCESS_MODAL_OPEN; payload: boolean }
  | { type: ActionType.SET_POOL_LIQUIDITY; payload: any }
  | {
      type: ActionType.SET_POOL_ASSET_TOKEN_DATA;
      payload: { tokenSymbol: string; assetTokenId: string; decimals: string };
    }
  | { type: ActionType.SET_TRANSFER_GAS_FEES_MESSAGE; payload: string }
  | { type: ActionType.SET_POOL_GAS_FEE; payload: string }
  | { type: ActionType.SET_ADD_LIQUIDITY_GAS_FEE; payload: string }
  | { type: ActionType.SET_POOLS_CARDS; payload: PoolCardProps[] }
  | { type: ActionType.SET_POOL_CARD_SELECTED; payload: PoolCardProps }
  | { type: ActionType.SET_POOLS_TOKEN_METADATA; payload: PoolsTokenMetadata[] };
