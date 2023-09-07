import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN, formatBalance } from "@polkadot/util";
import type { AnyJson } from "@polkadot/types/types/codec";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import dotAcpToast from "../../app/util/toast";
import { Dispatch } from "react";
import { WalletAction } from "../../store/wallet/interface";
import { ActionType } from "../../app/types/enum";
import "@polkadot/api-augment";

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
//to do
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

  const allAssets = await api.query.assets.asset.entries();

  const allChainAssets: { tokenData: AnyJson; tokenId: any }[] = [];

  allAssets.forEach((item) => {
    allChainAssets.push({ tokenData: item[1].toHuman(), tokenId: item[0].toHuman() });
  });

  const myAssetTokenData = [];

  for (const item of allChainAssets) {
    const cleanedTokenId = item.tokenId[0].replace(/[, ]/g, "");
    const tokenAsset = await api.query.assets.account(cleanedTokenId, walletAddress);

    if (tokenAsset.toHuman()) {
      const assetTokenMetadata = await api.query.assets.metadata(cleanedTokenId);

      const resultObject = {
        tokenId: cleanedTokenId,
        assetTokenMetadata: assetTokenMetadata.toHuman(),
        tokenAsset: tokenAsset.toHuman(),
      };

      myAssetTokenData.push(resultObject);
    }
  }

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

export const handleConnection = async (dispatch: Dispatch<WalletAction>, api: any) => {
  const extensions = await web3Enable("DOT-ACP-UI");
  if (!extensions) {
    throw Error("No Extension");
  }

  const allAccounts = await web3Accounts();

  dispatch({ type: ActionType.SET_ACCOUNTS, payload: allAccounts });
  dispatch({ type: ActionType.SET_SELECTED_ACCOUNT, payload: allAccounts[0] });

  if (api) {
    try {
      const walletTokens = await getWalletTokensBalance(api, allAccounts[0].address);
      dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: walletTokens });
      dotAcpToast.success("Success");
    } catch (error) {
      // dotAcpToast.error(`Error setting token balances: ${error}`);
      dotAcpToast.error("No wallet founded");
    }
  }
};
