import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatBalance } from "@polkadot/util";
import type { AnyJson } from "@polkadot/types/types/codec";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import dotAcpToast from "../../app/util/toast";
import { Dispatch } from "react";
import { WalletAction } from "../../store/wallet/interface";
import { ActionType } from "../../app/types/enum";
import "@polkadot/api-augment";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import { TokenBalanceData } from "../../app/types";
import LocalStorage from "../../app/util/localStorage";

export const setupPolkadotApi = async () => {
  const wsProvider = new WsProvider(import.meta.env.VITE_WEST_MINT_RPC_URL);
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
    balance: formatBalance(balance?.free.toString(), { withUnit: tokenSymbol as string, withSi: false }),
    ss58Format,
    tokenDecimals: Array.isArray(tokenDecimals) ? tokenDecimals?.[0] : "",
    tokenSymbol: Array.isArray(tokenSymbol) ? tokenSymbol?.[0] : "",
    assets: myAssetTokenData,
  };

  return tokensInfo;
};

export const getExtensionsAndAccounts = async () => {
  const extensions = await web3Enable("DOT-ACP-UI");
  const allAccounts = await web3Accounts();

  return { extensions: extensions, accounts: allAccounts };
};

export const handleConnection = async (dispatch: Dispatch<WalletAction>) => {
  const extensionAndAccounts = await getExtensionsAndAccounts();

  const extensions = extensionAndAccounts.extensions;

  if (!extensions) {
    throw Error("No Extension");
  }

  dispatch({ type: ActionType.SET_WALLET_EXTENSIONS, payload: extensions as InjectedExtension[] });

  const allAccounts = extensionAndAccounts.accounts;

  dispatch({ type: ActionType.SET_ACCOUNTS, payload: allAccounts });
  dispatch({ type: ActionType.SET_SELECTED_ACCOUNT, payload: allAccounts?.[0] });
};

export const setTokenBalance = async (
  dispatch: Dispatch<WalletAction>,
  api: any,
  selectedAccount: InjectedAccountWithMeta
) => {
  if (api) {
    try {
      dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: true });

      const walletTokens: any = await getWalletTokensBalance(api, selectedAccount?.address);

      dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: walletTokens });

      LocalStorage.set("wallet-connected", selectedAccount);

      dotAcpToast.success("Account balance successfully fetched!");

      dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });

      dotAcpToast.error(`Wallet connection error: ${error}`);
    }
  }
};

export const handleDisconnect = (dispatch: Dispatch<WalletAction>) => {
  LocalStorage.remove("wallet-connected");
  dispatch({ type: ActionType.SET_ACCOUNTS, payload: [] });
  dispatch({ type: ActionType.SET_SELECTED_ACCOUNT, payload: {} as InjectedAccountWithMeta });
  dispatch({ type: ActionType.SET_TOKEN_BALANCES, payload: {} as TokenBalanceData });
};

export const connectWalletAndFetchBalance = async (
  dispatch: Dispatch<WalletAction>,
  api: any,
  connectedWalletAddress: InjectedAccountWithMeta
) => {
  dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: true });
  try {
    await setTokenBalance(dispatch, api, connectedWalletAddress);
    await handleConnection(dispatch);
    dispatch({ type: ActionType.SET_WALLET_CONNECT_LOADING, payload: false });
  } catch (error) {
    dotAcpToast.error(`Wallet connection error: ${error}`);
  }
};
