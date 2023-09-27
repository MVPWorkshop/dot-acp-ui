import type { AnyJson } from "@polkadot/types/types/codec";
import { InputEditedType } from "./enum";

export type LpTokenAsset = {
  balance: string;
  extra: string | null;
  reason: string;
  status: string;
};

export type PoolCardProps = {
  name: string;
  lpTokenAsset: LpTokenAsset | null;
  lpTokenId: string | null;
  assetTokenId: string;
  totalTokensLocked: {
    nativeToken: string;
    nativeTokenIcon: string;
    assetToken: string;
    assetTokenIcon: string;
  };
};

export type InputEditedProps = {
  inputType: InputEditedType;
};

export type TokenProps = {
  tokenSymbol: string;
  tokenId: string;
  decimals: string;
  tokenBalance: string;
};

export type TokenBalanceData = {
  balance: number;
  ss58Format: AnyJson;
  tokenDecimals: AnyJson;
  tokenSymbol: AnyJson;
  assets: any;
};

export type UrlParamType = {
  id: string;
};

export type PoolsTokenMetadata = {
  tokenId: string;
  assetTokenMetadata: any;
  tokenAsset: {
    balance: number | undefined;
  };
};
