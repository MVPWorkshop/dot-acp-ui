import { NetworkKeys } from "./app/types/enum";

type NetworkConfig = {
  nativeTokenSymbol: string;
  rpcUrl: string;
  parents: number;
  assethubSubscanUrl?: string;
};

export const NETWORKS: Record<NetworkKeys, NetworkConfig> = {
  [NetworkKeys.Westmint]: {
    nativeTokenSymbol: "WND",
    rpcUrl: "wss://westmint-rpc.polkadot.io",
    parents: 0,
    assethubSubscanUrl: "https://westmint.statescan.io/#/accounts/",
  },
  [NetworkKeys.Rococo]: {
    nativeTokenSymbol: "ROC",
    rpcUrl: "wss://rococo-asset-hub-rpc.polkadot.io/",
    parents: 1,
    assethubSubscanUrl: "https://assethub-rococo.subscan.io/account/",
  },
  [NetworkKeys.Kusama]: {
    nativeTokenSymbol: "KSM",
    rpcUrl: "wss://kusama-asset-hub-rpc.polkadot.io/",
    parents: 1,
    assethubSubscanUrl: "https://kusama.subscan.io/account/",
  },
};
