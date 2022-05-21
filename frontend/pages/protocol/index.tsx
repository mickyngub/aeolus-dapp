import { Suspense, useEffect } from "react";
import {
  MoralisContextValue,
  useERC20Balances,
  useNativeBalance,
} from "react-moralis";
import type { ReactElement } from "react";
import { useMoralis } from "react-moralis";
import "twin.macro";
import { SWRConfig } from "swr";

import Dashboard from "~/src/protocol/Dashboard";
import CryptoCards from "~/src/protocol/CryptoCards/CryptoCards";
import Layout from "~/src/ui/layout/Layout";
import PairCards from "~/src/protocol/PairCards/PairCards";
import Loading from "~/src/ui/loading/Loading";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import { fetcher } from "../api";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  : "/";

const Protocol = ({ fallback }: { [key: string]: any }) => {
  const { account, isWeb3Enabled, enableWeb3 }: MoralisContextValue =
    useMoralis();

  const {
    fetchERC20Balances,
    data,
    isFetching: isERC20Fetching,
  } = useERC20Balances();

  const {
    getBalances: fetchNativeBalances,
    data: nativeBalance,
    isFetching: isNativeFetching,
  } = useNativeBalance();

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
  }, [account, fetchERC20Balances, fetchNativeBalances]);
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
            <CanvasWind lightIntensity={0.3} />
            <div tw="absolute bottom-0 px-28 pb-2">
              <p tw="text-center text-5xl text-white ">AEOLUS PROTOCOL</p>
            </div>
          </div>
          <div tw="px-28">
            <div id="dashboard" tw="mt-12 mb-12 ">
              <Dashboard
                userERC20Balances={data}
                userNativeBalance={nativeBalance}
                isFetchingData={isERC20Fetching || isNativeFetching}
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

export default Protocol;
