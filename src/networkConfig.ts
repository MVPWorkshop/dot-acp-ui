import { NetworkKeys } from "./app/types/enum";

type NetworkConfig = {
  nativeTokenSymbol: string;
  rpcUrl: string;
  parents: number;
};

export const NETWORKS: Record<NetworkKeys, NetworkConfig> = {
  [NetworkKeys.Westmint]: {
    nativeTokenSymbol: "WND",
    rpcUrl: "wss://westmint-rpc.polkadot.io",
    parents: 0,
  },
  [NetworkKeys.Rococo]: {
    nativeTokenSymbol: "ROC",
    rpcUrl: "wss://rococo-asset-hub-rpc.polkadot.io/",
    parents: 1,
  },
};
