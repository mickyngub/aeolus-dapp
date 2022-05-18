import { Suspense, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  MoralisContextValue,
  useERC20Balances,
  useNativeBalance,
} from "react-moralis";
import type { ReactElement } from "react";
import { useMoralis } from "react-moralis";
import "twin.macro";
import Dashboard from "~/src/protocol/Dashboard";
import CryptoCards from "~/src/protocol/CryptoCards/CryptoCards";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import PairCards from "~/src/protocol/PairCards/PairCards";
import { fetcher } from "../api";
import { SWRConfig } from "swr";
import Loading from "~/src/ui/loading/Loading";
import Link from "next/link";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";

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

  const {
    isAuthenticated,
    account,
    user,
    isWeb3Enabled,
    enableWeb3,
  }: MoralisContextValue = useMoralis();

  const { fetchERC20Balances, data, isLoading, isFetching, error } =
    useERC20Balances();

  const { getBalances: fetchNativeBalances, data: nativeBalance } =
    useNativeBalance();

  useEffect(() => {
    (async () => {
      if (!isWeb3Enabled) {
        await enableWeb3();
      }
    })();
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    (async () => {
      await fetchERC20Balances();
      await fetchNativeBalances();
    })();
  }, [account]);
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
        <div tw="pb-16">
          <div tw="relative top-0 w-full border-t-2 border-b-2 border-white">
            <CanvasWind lightIntensity={0.5} />
            <div tw="absolute bottom-0 px-28 pb-2">
              <p tw="text-center text-5xl text-white ">AEOLUS PROTOCOL</p>
            </div>
          </div>
          <div tw="px-28">
            <div id="dashboard" tw="mt-4 mb-12 ">
              <Dashboard
                userERC20Balances={data}
                userNativeBalance={nativeBalance}
              />
            </div>
            <div id="cryptoMarket" tw="my-12">
              <p tw="my-12 max-w-max border-2 border-white bg-secondary p-4 text-2xl font-bold">
                Cryptocurrency Prices by Market Cap
              </p>
              <CryptoCards />
            </div>
            <div id="pair" tw="">
              <p tw="my-12 max-w-max border-2 border-white bg-secondary p-4 text-2xl font-bold">
                Aeolus Pairs
              </p>
              <PairCards />
            </div>
          </div>
        </div>
      </Suspense>
    </SWRConfig>
  );
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="protocol">{page}</Layout>;
};

export default Protocol;
