import { FC, useEffect, useState } from "react";
import { ReactComponent as Logo } from "./assets/img/logo.svg";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { ApiPromise } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { AnyJson } from "@polkadot/types/types/codec";
import { setupPolkadotApi, getWalletTokensBalance } from "./services/polkadotServices";

interface TokenData {
  balance: AnyJson;
  ss58Format: AnyJson;
  tokenDecimals: AnyJson;
  tokenSymbol: AnyJson;
}
const App: FC = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setsSelectedAccount] = useState<InjectedAccountWithMeta>();
  const [tokenBalances, setTokenBalances] = useState<TokenData>();

  const callApiSetup = async () => {
    try {
      const polkaApi = await setupPolkadotApi();
      setApi(polkaApi);
    } catch (error) {
      console.error("Error setting up Polkadot API:", error);
    }
  };

  useEffect(() => {
    callApiSetup();
  }, []);

  useEffect(() => {
    if (!api) return;
    (async () => {
      const time = await api?.query.timestamp.now();
      console.log(time.toPrimitive());
      console.log(api);
    })();
  }, [api]);

  const handleConnection = async () => {
    const extensions = await web3Enable("DOT-ACP-UI");
    if (!extensions) {
      throw Error("No Extension");
    }
    console.log(extensions);
    const allAccounts = await web3Accounts();
    console.log(allAccounts);
    setAccounts(allAccounts);
    setsSelectedAccount(allAccounts[0]);
    console.log("accounts", accounts);
    if (api) {
      try {
        const walletTokens = await getWalletTokensBalance(api, allAccounts[0].address);
        console.log(walletTokens);
        setTokenBalances(walletTokens);
      } catch (error) {
        console.error("Error setting token balances:", error);
      }
    }
  };
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <Logo className="w-48" />
      <RouterProvider router={router} />
      <button onClick={handleConnection}>Connect</button>
      <p>Wallet: {selectedAccount?.meta.source}</p>
      <p>Address: {selectedAccount?.address}</p>
      <p>
        Balance: {tokenBalances?.balance ? tokenBalances?.balance.toString() : ""}{" "}
        {tokenBalances?.tokenSymbol ? tokenBalances?.tokenSymbol.toString() : ""}
      </p>
    </div>
  );
};

export default App;
