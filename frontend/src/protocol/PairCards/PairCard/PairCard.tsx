import React from "react";
import "twin.macro";
import useSWR from "swr";
import { fetcher } from "~/pages/api";
import { AnimationOnScroll } from "react-animation-on-scroll";

interface Props {
  pairData: Pair;
}

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  : "/";

const PairCard = ({ pairData }: Props) => {
  const { data: crypto0Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + pairData.token0ID,
    fetcher
  );
  const { data: crypto1Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + pairData.token1ID,
    fetcher
  );
  return (
    <AnimationOnScroll animateIn="animate__fadeIn">
      <div tw="transition-duration[300ms] h-full w-56 border-2 border-white hover:translate-x-0.5 hover:-translate-y-1 hover:opacity-80">
        <div tw="flex items-center gap-4 border-b-2 border-white bg-accent-500  p-2 text-white ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* <img
            src={cryptoData.image}
            alt={cryptoData.name + " image"}
            tw="h-12 w-12"
          /> */}
          <div tw="flex flex-col items-center">
            {crypto0Data && crypto1Data && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  tw="h-8 w-8"
                  src={crypto0Data[0].image}
                  alt={`${crypto0Data[0].id} pic`}
                />
                <p tw="text-primary">x</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  tw="h-8 w-8"
                  src={crypto1Data[0].image}
                  alt={`${crypto1Data[0].id} pic`}
                />
              </>
            )}
          </div>
          <p tw="text-lg">{pairData.pairName}</p>
        </div>
        <div tw="border-2 border-accent-500 bg-white bg-noise ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div tw="flex flex-col gap-4 p-2">
            <p tw="flex justify-between text-sm font-bold">
              <span>⚖ &nbsp;Ratio: </span>
              <span>{pairData.ratio}</span>
            </p>
            <div>
              <p tw="flex justify-between text-sm font-bold">
                <span>∇ &nbsp;{pairData.token0} Price:</span>
                <span>
                  &nbsp;$
                  {crypto0Data && crypto0Data[0].current_price}
                </span>
              </p>
              <p tw="flex justify-between text-sm">
                <span>↑ &nbsp;{pairData.token0} 24 High:</span>
                <span>
                  &nbsp;$
                  {crypto0Data && crypto0Data[0].high_24h}
                </span>
              </p>
              <p tw="flex justify-between text-sm">
                <span>↓ &nbsp;{pairData.token0} 24 Low:</span>
                <span>
                  &nbsp;$
                  {crypto0Data && crypto0Data[0].low_24h}
                </span>
              </p>
            </div>
            <div>
              <p tw="flex justify-between text-sm font-bold">
                <span>∇ &nbsp;{pairData.token1} Price:</span>
                <span>
                  &nbsp;$
                  {crypto1Data && crypto1Data[0].current_price}
                </span>
              </p>
              <p tw="flex justify-between text-sm">
                <span>↑ &nbsp;{pairData.token0} 24 High:</span>
                <span>
                  &nbsp;$
                  {crypto1Data && crypto1Data[0].high_24h}
                </span>
              </p>
              <p tw="flex justify-between text-sm">
                <span>↓ &nbsp;{pairData.token0} 24 Low:</span>
                <span>
                  &nbsp;$
                  {crypto1Data && crypto1Data[0].low_24h}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimationOnScroll>
    // <div tw="h-56 w-56 border-2 border-white">
    //   BTC / BNB / SOL
    //   <div>
    //     <p>Ratio 0.333 : 0.333 : 0.333</p>
    //   </div>
    // </div>
  );
};

export default PairCard;
