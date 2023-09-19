export const enum ButtonVariants {
  btnPrimaryPinkLg = "btn-primary-pink-lg",
  btnPrimaryPinkSm = "btn-primary-pink-sm",
  btnPrimaryGhostLg = "btn-primary-ghost-lg",
  btnPrimaryGhostSm = "btn-primary-ghost-sm",
  btnSecondaryWhite = "btn-secondary-white",
  btnSecondaryGray = "btn-secondary-gray",
  btnInteractivePink = "btn-interactive-pink",
  btnInteractiveGhost = "btn-interactive-ghost",
  btnInteractiveDisabled = "btn-interactive-disabled",
  btnSelectPink = "btn-select-pink",
  btnSelectGray = "btn-select-gray",
  btnSelectDisabled = "btn-select-disabled",
}

export enum ActionType {
  SET_API = "SET_API",
  SET_ACCOUNTS = "SET_ACCOUNTS",
  SET_SELECTED_ACCOUNT = "SET_SELECTED_ACCOUNT",
  SET_TOKEN_BALANCES = "SET_TOKEN_BALANCES",
  SET_POOLS = "SET_POOLS",
  SET_POOL_CREATED = "SET_POOL_CREATED",
  SET_POOL_LIQUIDITY = "SET_POOL_LIQUIDITY",
  SET_POOL_ASSET_TOKEN_DATA = "SET_POOL_ASSET_TOKEN_DATA",
  SET_TRANSFER_GAS_FEES_MESSAGE = "SET_TRANSFER_GAS_FEES_MESSAGE",
  SET_POOL_GAS_FEE = "SET_POOL_GAS_FEE",
  SET_ADD_LIQUIDITY_GAS_FEE = "SET_ADD_LIQUIDITY_GAS_FEE",
  SET_POOLS_CARDS = "SET_POOLS_CARDS",
  SET_SWAP_FINALIZED = "SET_SWAP_FINALIZED",
  SET_POOL_CARD_SELECTED = "SET_POOL_CARD_SELECTED",
}

export enum TokenSelection {
  TokenA = "tokenA",
  TokenB = "tokenB",
  None = "none",
  NativeToken = "WND",
}

export enum InputEditedType {
  exactIn = "exactIn",
  exactOut = "exactOut",
}
