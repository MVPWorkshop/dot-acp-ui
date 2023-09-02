export const enum ButtonVariants {
  btnPrimary = "btn-primary",
  btnSecondary = "btn-secondary",
  btnInteractive = "btn-interactive",
  btnPrimarySelect = "btn-primary-select",
  btnSecondarySelect = "btn-secondary-select",
  btnDisabled = "btn-disabled",
  btnInteractiveDisabled = "btn-interactive-disabled",
}

export const enum ButtonText {
  btnTextSmall = "small",
  btnTextMedium = "medium",
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
}
