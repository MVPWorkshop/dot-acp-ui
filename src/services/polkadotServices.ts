import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN, formatBalance } from "@polkadot/util";
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
export const toUnit = (balance: string, decimals: number) => {
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(balance).divmod(base);
  return parseFloat(dm.div.toString());
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
  // const tokenAsset = async (tokenId:AnyJson , address: string) => {
  //   return await api.query.assets.account(tokenId, address)

  // }
  const allAssets = await api.query.assets.asset.entries();
  const allChainAssets: { tokenData: AnyJson; tokenId: AnyJson }[] = [];
  allAssets.forEach((item) => {
    allChainAssets.push({ tokenData: item[1].toHuman(), tokenId: item[0].toHuman() });
  });
  // console.log("allChainAssets", allChainAssets);

  // const myChainAssets: { tokenData: AnyJson; tokenId: AnyJson }[] = [];
  // const myChainAssets = allChainAssets.filter((item) => item.tokenData?.owner === walletAddress);
  // console.log("myChainAssets", myChainAssets);

  const myAssetTokenData = [];

  for (const item of allChainAssets) {
    const cleanedTokenId = item.tokenId[0].replace(/[, ]/g, "");
    const tokenAsset = await api.query.assets.account(cleanedTokenId, walletAddress);
    if (tokenAsset.toHuman()) {
      const assetTokenMetadata = await api.query.assets.metadata(cleanedTokenId);
      // const balance = tokenAsset.toHuman().balance.replace(/[, ]/g, "").toString();
      // const decimals = assetTokenMetadata.decimals;

      // const transformedBalance = toUnit(balance, decimals);

      const resultObject = {
        tokenId: cleanedTokenId,
        assetTokenMetadata: assetTokenMetadata.toHuman(),
        tokenAsset: tokenAsset.toHuman(),
        //   balance: transformedBalance
        // },
      };

      myAssetTokenData.push(resultObject);
    }
  }

  console.log("resultsArray", myAssetTokenData);
  // myAssetTokenData.forEach((item) => {
  //   console.log(
  //     formatBalance(
  //       item.tokenAsset.balance.replace(/[, ]/g, "").toString(),
  //       { withUnit: item.assetTokenMetadata.symbol as string, withSi: true },
  //       item.assetTokenMetadata.decimals
  //     ),
  //     item.assetTokenMetadata.decimals,
  //     item.tokenAsset.balance
  //   );
  //   console.log(toUnit(item.tokenAsset.balance.replace(/[, ]/g, "").toString(), item.assetTokenMetadata.decimals));
  // });

  // console.log("myChainAssets", myChainAssets);
  // const assetTokenMetadata = await api.query.assets.metadata("91");
  // console.log("assetTokenMetadata", assetTokenMetadata.toHuman());

  // const assetToken = await api.query.assets.account("91", walletAddress);
  // console.log("assetToken", assetToken.toHuman());

  const ss58Format = tokenMetadata?.ss58Format.toHuman();
  const tokenDecimals = tokenMetadata?.tokenDecimals.toHuman();
  const tokenSymbol = tokenMetadata?.tokenSymbol.toHuman();

  console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);

  const tokensInfo = {
    balance: formatBalance(balance.free.toString(), { withUnit: tokenSymbol as string, withSi: false }),
    ss58Format,
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol[0] : "",
    assets: myAssetTokenData,
  };

  return tokensInfo;
};
