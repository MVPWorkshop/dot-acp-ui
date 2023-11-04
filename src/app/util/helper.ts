import type { AnyJson } from "@polkadot/types/types/codec";
import { Decimal } from "decimal.js";
import { t } from "i18next";
import { UrlParamType } from "../types";
import * as Sentry from "@sentry/react";

export const init = () => {
  // Sentry
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
  });
};

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
    .toFixed()
    .toString();
};

export const formatDecimalsFromToken = (base: number, decimals: string) => {
  return new Decimal(base).dividedBy(Math.pow(10, parseFloat(decimals))).toNumber();
};

export const checkIfPoolAlreadyExists = (id: string, poolArray: AnyJson[]) => {
  let exists = false;

  if (id && poolArray) {
    exists = !!poolArray?.find((pool: any) => {
      return (
        pool?.[0]?.[1]?.interior?.X2 &&
        pool?.[0]?.[1]?.interior?.X2?.[1]?.GeneralIndex?.replace(/[, ]/g, "").toString() === id
      );
    });
  }

  return exists;
};

export const truncateDecimalNumber = (number: number, size = 2): number => {
  const value = number.toString().split(".");

  if (value?.[1]) {
    return Number(`${value[0]}.${value[1].slice(0, size)}`);
  }

  return Number(value);
};
