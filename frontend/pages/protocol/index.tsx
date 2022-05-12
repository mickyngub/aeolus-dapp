import { Suspense } from "react";
import { ethers } from "ethers";
import type { ReactElement } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import "twin.macro";
import Dashboard from "~/src/protocol/Dashboard";
import CryptoCards from "~/src/protocol/CryptoCards/CryptoCards";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import PoolCards from "~/src/protocol/PoolCards/PoolCards";
import { fetcher } from "../api/hello";
import { SWRConfig } from "swr";
import Loading from "~/src/ui/loading/Loading";
import Link from "next/link";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";

const poolCards = [
  { name: "Bitcoin-USDT", url: "BTC-USDT" },
  { name: "Ethereum-BNB-USDT", url: "ETH-BNB-USDT" },
];

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  : "/";

export async function getStaticProps() {
  const cryptoDatas: CryptoData = await fetcher(coinGeckoAPI);
  return {
    props: {
      fallback: {
        [coinGeckoAPI]: cryptoDatas,
      },
    },
  };
}

const Protocol = ({ fallback }: { [key: string]: any }) => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();
  const [address, setAddress] = useState<string>("");
  // const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

  // const handleConnectWallet = async () => {
  //   console.log("clicked connect wallet");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   const signer = provider.getSigner();
  //   const signerAddress = await signer.getAddress();
  //   setAddress(signerAddress);
  //   setSigner(signer);
  //   notifyWalletConnected();
  // };

  const connectWalletMoralis = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Signin to Aeolus Protocol" })
        .then((user) => {
          console.log("logged in user", user);

          const address = user!.get("ethAddress");
          setAddress(address);
          notifyWalletConnected();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const moralisLogout = async () => {
    await logout();
    console.log("logged out");
  };
  const notifyWalletConnected = () => {
    toast("Wallet Connected");
  };
  return (
    <SWRConfig value={{ fallback }}>
      <Suspense
        fallback={
          <div tw="min-h-full bg-primary bg-noise">
            <div tw="absolute top-0 bottom-0 right-0 left-0 m-auto grid h-32 w-32 place-content-center  ">
              <Loading />
            </div>
          </div>
        }
      >
        <div tw="pb-6">
          <div tw="relative top-0 w-full">
            <CanvasWind lightIntensity={0.5} />
            <div tw="absolute bottom-0 px-28 pb-2">
              <p tw="text-center text-3xl text-white">
                START YOUR INVESTMENT JOURNEY WITH AEOLUS
              </p>
            </div>
            <div tw="absolute top-4 flex w-full items-center px-28">
              <div tw="flex-1">
                <Link href="/main">
                  <a>
                    <Button size="extraSmall">Back</Button>
                  </a>
                </Link>
              </div>
              {!isAuthenticated ? (
                <Button size="extraSmall" onClick={connectWalletMoralis}>
                  Connect Wallet
                </Button>
              ) : (
                <div tw="flex items-center gap-4">
                  {address}
                  <Button size="extraSmall" onClick={moralisLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div tw="px-28">
            <div id="dashboard" tw="my-12">
              <p tw="mb-4 text-2xl font-bold">Dashboard</p>
              <Dashboard />
            </div>
            <div id="cryptoMarket" tw="my-12">
              <p tw="my-4 text-2xl font-bold">
                Cryptocurrency Prices by Market Cap
              </p>
              <CryptoCards />
            </div>
            <div id="pool" tw="">
              <p tw="my-4 text-2xl font-bold">Pools</p>
              <PoolCards />
            </div>
          </div>
          <ToastContainer />
        </div>
      </Suspense>
    </SWRConfig>
  );
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="protocol">{page}</Layout>;
};

export default Protocol;
