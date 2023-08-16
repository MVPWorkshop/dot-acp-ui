import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatBalance } from "@polkadot/util";

export const setupPolkadotApi = async () => {
  const wsProvider = new WsProvider("wss://westmint-rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  return api;
};

export const getWalletTokensBalance = async (api: ApiPromise, walletAddress: string) => {
  const now = await api.query.timestamp.now();
  const { nonce, data: balance } = await api.query.system.account(walletAddress);
  const nextNonce = await api.rpc.system.accountNextIndex(walletAddress);
  const tokenMetadata = await api.registry.getChainProperties();

  const ss58Format = tokenMetadata?.ss58Format.toHuman();
  const tokenDecimals = tokenMetadata?.tokenDecimals.toHuman();
  const tokenSymbol = tokenMetadata?.tokenSymbol.toHuman();

  console.log("SS58 Format:", ss58Format);
  console.log("Token Decimals:", tokenDecimals);
  console.log("Token Symbol:", tokenSymbol);

  console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);

  const tokenInfo = {
    balance: formatBalance(balance.free.toString(), { withUnit: tokenSymbol as string, withSi: false }),
    ss58Format,
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol[0] : "",
  };

  return tokenInfo;
};
