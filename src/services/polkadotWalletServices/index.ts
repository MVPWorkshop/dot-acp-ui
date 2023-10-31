import { ApiPromise, WsProvider } from "@polkadot/api";
import "@polkadot/api-augment";
import type { AnyJson } from "@polkadot/types/types/codec";
import { formatBalance } from "@polkadot/util";
import type { Wallet, WalletAccount } from "@talismn/connect-wallets";
import { getWalletBySource, getWallets } from "@talismn/connect-wallets";
import { Dispatch } from "react";
import { TokenBalanceData } from "../../app/types";
import { ActionType } from "../../app/types/enum";
import { formatDecimalsFromToken } from "../../app/util/helper";
import LocalStorage from "../../app/util/localStorage";
import dotAcpToast from "../../app/util/toast";
import { WalletAction } from "../../store/wallet/interface";

export const setupPolkadotApi = async () => {
  const wsProvider = new WsProvider(import.meta.env.VITE_NETWORK_RPC_URL);
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
  const tokenMetadata = api.registry.getChainProperties();
  const existentialDeposit = await api.consts.balances.existentialDeposit;

  const allAssets = await api.query.assets.asset.entries();

  const allChainAssets: { tokenData: AnyJson; tokenId: any }[] = [];

  allAssets.forEach((item) => {
    allChainAssets.push({ tokenData: item?.[1].toHuman(), tokenId: item?.[0].toHuman() });
  });

  const myAssetTokenData = [];

  for (const item of allChainAssets) {
    const cleanedTokenId = item?.tokenId?.[0]?.replace(/[, ]/g, "");
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

  console.log(`${now}: balance of ${balance?.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);

  const tokensInfo = {
    balance:
      Number(balance?.free.toString().length) > Number(tokenDecimals)
        ? formatBalance(balance?.free.toString(), { withUnit: tokenSymbol as string, withSi: false })
        : formatDecimalsFromToken(Number(balance?.free.toString()), tokenDecimals as string),
    ss58Format,
    existentialDeposit: existentialDeposit.toHuman(),
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals?.[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol?.[0] : "",
    assets: myAssetTokenData,
  };

  return tokensInfo;
};

export const assetTokenData = async (id: string, api: ApiPromise) => {
  const assetTokenMetadata = await api.query.assets.metadata(id);

  const resultObject = {
    tokenId: id,
    assetTokenMetadata: assetTokenMetadata.toHuman(),
  };
  return resultObject;
};

export const getSupportedWallets = () => {
  const supportedWallets: Wallet[] = getWallets();

  return supportedWallets;
};

export const setTokenBalance = async (dispatch: Dispatch<WalletAction>, api: any, selectedAccount: WalletAccount) => {
  if (api) {
    dispatch({ type: ActionType.SET_ASSET_LOADING, payload: true });
    try {
      const walletTokens: any = await getWalletTokensBalance(api, selectedAccount?.address);

      dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: walletTokens });

      LocalStorage.set("wallet-connected", selectedAccount);

      dotAcpToast.success("Wallet successfully connected!");
    } catch (error) {
      dotAcpToast.error(`Wallet connection error: ${error}`);
    } finally {
      dispatch({ type: ActionType.SET_ASSET_LOADING, payload: false });
    }
  }
};

export const setTokenBalanceUpdate = async (
  api: ApiPromise,
  walletAddress: string,
  assetId: string,
  oldWalletBalance: any
) => {
  const { data: balance } = await api.query.system.account(walletAddress);
  const tokenMetadata = api.registry.getChainProperties();
  const tokenSymbol = tokenMetadata?.tokenSymbol.toHuman();
  const ss58Format = tokenMetadata?.ss58Format.toHuman();
  const tokenDecimals = tokenMetadata?.tokenDecimals.toHuman();
  const nativeTokenNewBalance = formatBalance(balance?.free.toString(), {
    withUnit: tokenSymbol as string,
    withSi: false,
  });
  const existentialDeposit = await api.consts.balances.existentialDeposit;

  const tokenAsset = await api.query.assets.account(assetId, walletAddress);

  const assetsUpdated = oldWalletBalance.assets;

  if (tokenAsset.toHuman()) {
    const assetTokenMetadata = await api.query.assets.metadata(assetId);

    const resultObject = {
      tokenId: assetId,
      assetTokenMetadata: assetTokenMetadata.toHuman(),
      tokenAsset: tokenAsset.toHuman(),
    };

    const assetInPossession = assetsUpdated.findIndex((item: any) => item.tokenId === resultObject.tokenId);

    if (assetInPossession !== -1) {
      assetsUpdated[assetInPossession] = resultObject;
    } else {
      assetsUpdated.push(resultObject);
    }
  }

  const updatedTokensInfo = {
    balance: nativeTokenNewBalance,
    ss58Format,
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals?.[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol?.[0] : "",
    assets: assetsUpdated,
    existentialDeposit: existentialDeposit.toHuman(),
  };

  return updatedTokensInfo;
};

export const setTokenBalanceAfterAssetsSwapUpdate = async (
  api: ApiPromise,
  walletAddress: string,
  assetAId: string,
  assetBId: string,
  oldWalletBalance: any
) => {
  const { data: balance } = await api.query.system.account(walletAddress);
  const tokenMetadata = api.registry.getChainProperties();
  const tokenSymbol = tokenMetadata?.tokenSymbol.toHuman();
  const ss58Format = tokenMetadata?.ss58Format.toHuman();
  const tokenDecimals = tokenMetadata?.tokenDecimals.toHuman();
  const nativeTokenNewBalance = formatBalance(balance?.free.toString(), {
    withUnit: tokenSymbol as string,
    withSi: false,
  });

  const tokenAssetA = await api.query.assets.account(assetAId, walletAddress);
  const tokenAssetB = await api.query.assets.account(assetBId, walletAddress);

  const assetsUpdated = oldWalletBalance.assets;

  if (tokenAssetA.toHuman() && tokenAssetB.toHuman()) {
    const assetTokenAMetadata = await api.query.assets.metadata(assetAId);
    const assetTokenBMetadata = await api.query.assets.metadata(assetBId);

    const resultObjectA = {
      tokenId: assetAId,
      assetTokenMetadata: assetTokenAMetadata.toHuman(),
      tokenAsset: tokenAssetA.toHuman(),
    };
    const resultObjectB = {
      tokenId: assetBId,
      assetTokenMetadata: assetTokenBMetadata.toHuman(),
      tokenAsset: tokenAssetB.toHuman(),
    };

    const assetAInPossession = assetsUpdated.findIndex((item: any) => item.tokenId === resultObjectA.tokenId);
    const assetBInPossession = assetsUpdated.findIndex((item: any) => item.tokenId === resultObjectB.tokenId);

    if (assetAInPossession !== -1) {
      assetsUpdated[assetAInPossession] = resultObjectA;
    }

    if (assetBInPossession !== -1) {
      assetsUpdated[assetBInPossession] = resultObjectB;
    } else {
      assetsUpdated.push(resultObjectB);
    }
  }

  const updatedTokensInfo = {
    balance: nativeTokenNewBalance,
    ss58Format,
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals?.[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol?.[0] : "",
    assets: assetsUpdated,
  };

  return updatedTokensInfo;
};

export const handleDisconnect = (dispatch: Dispatch<WalletAction>) => {
  LocalStorage.remove("wallet-connected");
  dispatch({ type: ActionType.SET_ACCOUNTS, payload: [] });
  dispatch({ type: ActionType.SET_SELECTED_ACCOUNT, payload: {} as WalletAccount });
  dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: {} as TokenBalanceData });
};

export const connectWalletAndFetchBalance = async (
  dispatch: Dispatch<WalletAction>,
  api: any,
  account: WalletAccount
) => {
  dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: true });
  const wallet = getWalletBySource(account.wallet?.extensionName);
  wallet?.enable("DOT-ACP");
  dispatch({ type: ActionType.SET_SELECTED_ACCOUNT, payload: account });
  LocalStorage.set("wallet-connected", account);
  dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
  try {
    await setTokenBalance(dispatch, api, account);
  } catch (error) {
    dotAcpToast.error(`Wallet connection error: ${error}`);
  }
};
