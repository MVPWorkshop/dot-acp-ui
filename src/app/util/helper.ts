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

export const calculateSlippage = (base: string, percent: number | undefined = 0) => {
  const result = (parseFloat(base) * percent) / 100;
  return Math.ceil(result);
};

export const formatInputTokenValue = (base: number, decimals: string) => {
  return new Decimal(base).times(Math.pow(10, parseFloat(decimals))).toString();
};

export const formatDecimalsFromToken = (base: number, decimals: string) => {
  return new Decimal(base).dividedBy(Math.pow(10, parseFloat(decimals))).toNumber();
};
