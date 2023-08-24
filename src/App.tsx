import { FC, useEffect, useReducer } from "react";
import { ReactComponent as Logo } from "./assets/img/logo.svg";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { setupPolkadotApi, getWalletTokensBalance, toUnit } from "./services/polkadotServices";
import { reducer, initialState } from "./stateReducer/walletStateReducer";

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { api, accounts, selectedAccount, tokenBalances } = state;

  const callApiSetup = async () => {
    try {
      const polkaApi = await setupPolkadotApi();
      dispatch({ type: "SET_API", payload: polkaApi });
    } catch (error) {
      console.error("Error setting up Polkadot API:", error);
    }
  };

  useEffect(() => {
    callApiSetup();
  }, []);

  // useEffect(() => {
  //   if (!api) return;
  //   (async () => {
  //     const time = await api?.query.timestamp.now();
  //     console.log(time.toPrimitive());
  //   })();
  // }, [api]);

  const handleConnection = async () => {
    const extensions = await web3Enable("DOT-ACP-UI");
    if (!extensions) {
      throw Error("No Extension");
    }
    console.log(extensions);
    const allAccounts = await web3Accounts();
    console.log(allAccounts);
    dispatch({ type: "SET_ACCOUNTS", payload: allAccounts });
    dispatch({ type: "SET_SELECTED_ACCOUNT", payload: allAccounts[0] });
    console.log("accounts", accounts);
    if (api) {
      try {
        const walletTokens = await getWalletTokensBalance(api, allAccounts[0].address);
        console.log(walletTokens);
        dispatch({ type: "SET_TOKEN_BALANCES", payload: walletTokens });
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
      <p>Assets:</p>
      <div>
        {tokenBalances?.assets?.map((item: any, index: number) => (
          <div key={index}>
            <ul>
              <li>Name: {item.assetTokenMetadata.name}</li>
              <li>
                {toUnit(item.tokenAsset.balance.replace(/[, ]/g, "").toString(), item.assetTokenMetadata.decimals)}{" "}
                {item.assetTokenMetadata.symbol}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
