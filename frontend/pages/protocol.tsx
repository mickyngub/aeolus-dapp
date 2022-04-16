import { ethers } from "ethers";
import type { ReactElement } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import "twin.macro";
import Dashboard from "~/src/protocol/Dashboard";
import PoolCard from "~/src/protocol/PoolCard";
import PriceChart from "~/src/protocol/PriceChart";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";

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
    <div tw="bg-primary">
      <div tw="p-6 text-right">
        {!address ? (
          <Button size="small" onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        ) : (
          address
        )}
      </div>
      <div tw="p-6">
        <Dashboard />
      </div>
      <div tw="p-6">
        <PriceChart />
      </div>
      <div tw="p-6">
        <PoolCard />
      </div>
      <ToastContainer />
    </div>
  );
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="protocol">{page}</Layout>;
};

export default Protocol;
