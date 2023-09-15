export type LpTokenAsset = {
  balance: string;
  extra: string | null;
  reason: string;
  status: string;
};

export type PoolsCardsProps = {
  name: string;
  lpTokenAsset: LpTokenAsset | null;
  totalTokensLocked: {
    nativeToken: string;
    nativeTokenIcon: string;
    assetToken: string;
    assetTokenIcon: string;
  };
};

export type InputEditedProps = {
  inputType: "exactIn" | "exactOut";
};
