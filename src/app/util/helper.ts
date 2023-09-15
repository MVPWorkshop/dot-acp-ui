import { t } from "i18next";
import { Decimal } from "decimal.js";

const init = () => {
  // start sentry
  // start analytics
};

export { init };

export const reduceAddress = (address: string | undefined, lengthLeft: number, lengthRight: number) => {
  if (address) {
    const addressLeftPart = address.substring(0, lengthLeft);
    const addressRightPart = address.substring(48 - lengthRight, 48);
    return `${addressLeftPart}...${addressRightPart}`;
  }
  return t("wallet.notConnected");
};

export const calculateSlippage = (tokenValue: number, slippageValue: number) => {
  return tokenValue - (tokenValue * slippageValue) / 100;
};

export const formatInputTokenValue = (base: number, decimals: string) => {
  return new Decimal(base).times(Math.pow(10, parseFloat(decimals))).toString();
};

export const formatDecimalsFromToken = (base: number, decimals: string) => {
  return new Decimal(base).dividedBy(Math.pow(10, parseFloat(decimals))).toNumber();
};
