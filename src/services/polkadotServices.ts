import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatBalance } from "@polkadot/util";
import type { AnyJson } from "@polkadot/types/types/codec";

export const setupPolkadotApi = async () => {
  const wsProvider = new WsProvider("wss://westmint-rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });
  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  const metadata = await api.rpc.state.getMetadata();
  console.log("metadata", metadata.toHuman());

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  return api;
};

export const getWalletTokensBalance = async (api: ApiPromise, walletAddress: string) => {
  const now = await api.query.timestamp.now();
  const { nonce, data: balance } = await api.query.system.account(walletAddress);
  const nextNonce = await api.rpc.system.accountNextIndex(walletAddress);
  const tokenMetadata = await api.registry.getChainProperties();

  //   const assets = await api.query;
  //   console.log('Assets:', assets)
  //   const assetConversion = await api.query.assetConversion.palletVersion();
  //   console.log(assetConversion.toHuman();
  //   const assetAsset = await api.query.assets.asset("45");
  //   console.log("assetAsset",assetAsset.toHuman())
  //   const palletVersion = await api.query.assets.palletVersion();
  //   console.log(palletVersion.toHuman())

  const allAssets = await api.query.assets.asset.entries();
  const allChainAssets: { tokenData: AnyJson; tokenId: AnyJson }[] = [];
  allAssets.forEach((item) => {
    allChainAssets.push({ tokenData: item[1].toHuman(), tokenId: item[0].toHuman() });
    console.log("allChainAssets", allChainAssets);
  });
  console.log("allChainAssets", allChainAssets);
  const myChainAssets = allChainAssets.filter((item) => item.tokenData?.owner === walletAddress);
  console.log("myChainAssets", myChainAssets);
  const assetTokenMetadata = await api.query.assets.metadata("45");
  console.log("assetTokenMetadata", assetTokenMetadata.toHuman());

  const assetToken = await api.query.assets.account("45", walletAddress);
  console.log("assetToken", assetToken.toHuman());

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
