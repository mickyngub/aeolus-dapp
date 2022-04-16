import { ethers } from "ethers";
import type { ReactElement } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import "twin.macro";
import Dashboard from "~/src/protocol/Dashboard";
import CryptoCards from "~/src/protocol/CryptoCards/CryptoCards";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import Link from "next/link";
import PoolCards from "~/src/protocol/PoolCards/PoolCards";

const poolCards = [
  { name: "Bitcoin-USDT", url: "BTC-USDT" },
  { name: "Ethereum-BNB-USDT", url: "ETH-BNB-USDT" },
];
const Protocol = () => {
  const [address, setAddress] = useState<string>("");
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

  const handleConnectWallet = async () => {
    console.log("clicked connect wallet");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    setAddress(signerAddress);
    setSigner(signer);
    notifyWalletConnected();
  };
  const notifyWalletConnected = () => {
    toast("Wallet Connected");
  };
  return (
    <div tw="bg-primary bg-noise">
      <div tw="p-6 text-right">
        {!address ? (
          <Button size="small" onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        ) : (
          address
        )}
      </div>
      <div id="#dashboard" tw="p-6">
        <Dashboard />
      </div>
      <div tw="p-6">
        <p tw="text-2xl">Cryptocurrency Market</p>
        <CryptoCards />
      </div>
      <div tw="p-6">
        <p tw="text-2xl ">Pools</p>
        <PoolCards />
      </div>
      <ToastContainer />
    </div>
  );
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="protocol">{page}</Layout>;
};

export default Protocol;
