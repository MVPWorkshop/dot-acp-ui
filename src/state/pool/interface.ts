export interface PoolCardsData {
  tokenSymbol: string;
  nativeTokenBalance: number;
  assetTokenBalance: number;
}

export interface AppState {
  poolCardsData: PoolCardsData[];
}

export type Action = { type: "SET_POOL_CARDS_DATA"; payload: PoolCardsData };
