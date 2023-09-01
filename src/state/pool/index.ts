import { AppState, Action } from "./interface";

export const initialState: AppState = {
  poolCardsData: [],
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_POOL_CARDS_DATA":
      return { ...state, poolCardsData: [...state.poolCardsData, action.payload] };
    default:
      return state;
  }
};
