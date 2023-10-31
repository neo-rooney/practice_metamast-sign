import "./App.css";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { Buffer } from "buffer";

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState({ accounts: [] });
  const [dataWithSign, setDataWithSign] = useState<any>();

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));
    };

    getProvider();
  }, []);

  const updateWallet = async (accounts: any) => {
    setWallet({ accounts });
  };

  const handleSign = async (address: string) => {
    const from = address;
    const data = {
      address,
      timestamp: new Date().getTime(),
      state: "from bellyland",
    };

    const msg = `0x${Buffer.from(JSON.stringify(data), "utf8").toString(
      "hex"
    )}`;

    const sign = await window.ethereum.request({
      method: "personal_sign",
      params: [msg, from],
    });
    setDataWithSign({ ...data, sign });
  };

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
    handleSign(accounts[0]);
  };

  const handleVerifiction = async () => {
    if (!dataWithSign) return;

    const { sign, ...data } = dataWithSign;

    const msg = `0x${Buffer.from(JSON.stringify(data), "utf8").toString(
      "hex"
    )}`;
    const ecRecoverAddr = await window.ethereum.request({
      method: "personal_ecRecover",
      params: [msg, sign],
    });

    console.log(ecRecoverAddr);
  };

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? "DOES" : "DOES NOT"} Exist</div>

      {hasProvider /* Updated */ && (
        <button onClick={handleConnect}>Connect MetaMask</button>
      )}

      {wallet.accounts.length > 0 && (
        <div>Wallet Accounts: {wallet.accounts[0]}</div>
      )}
      {dataWithSign && <div>SIGN : {dataWithSign.sign}</div>}
      {dataWithSign && <button onClick={handleVerifiction}>검증</button>}
    </div>
  );
};

export default App;
