import { t } from "i18next";
import { Decimal } from "decimal.js";
import { UrlParamType } from "../types";

export const reduceAddress = (address: string | undefined, lengthLeft: number, lengthRight: number) => {
  if (address) {
    const addressLeftPart = address.substring(0, lengthLeft);
    const addressRightPart = address.substring(48 - lengthRight, 48);
    return `${addressLeftPart}...${addressRightPart}`;
  }
  return t("wallet.notConnected");
};

export const urlTo = (path: string, params?: UrlParamType) => {
  for (const param in params) {
    path = path?.replace(new RegExp(`:${param}`, "g"), params[param as keyof UrlParamType]);
  }
  return path;
};

export const calculateSlippageReduce = (tokenValue: number, slippageValue: number) => {
  return new Decimal(tokenValue).minus(new Decimal(tokenValue).times(slippageValue).dividedBy(100)).toNumber();
};

export const calculateSlippageAdd = (tokenValue: number, slippageValue: number) => {
  return new Decimal(tokenValue).plus(new Decimal(tokenValue).times(slippageValue).dividedBy(100)).toNumber();
};

export const formatInputTokenValue = (base: number, decimals: string) => {
  return new Decimal(base)
    .times(Math.pow(10, parseFloat(decimals)))
    .floor()
    .toString();
};

export const formatDecimalsFromToken = (base: number, decimals: string) => {
  return new Decimal(base).dividedBy(Math.pow(10, parseFloat(decimals))).toNumber();
};
