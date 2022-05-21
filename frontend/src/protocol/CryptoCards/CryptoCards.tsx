import "twin.macro";
import useSWR from "swr";

import { fetcher } from "~/pages/api";
import CryptoCard from "./CryptoCard/CryptoCard";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  : "/";

const CryptoCards = () => {
  const { data: cryptoDatas }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI,
    fetcher
  );
  return (
    <div id="#cryptoMarket" tw="grid grid-cols-4 place-items-center gap-6">
      {cryptoDatas
        ? cryptoDatas.map((cryptoData) => (
            <CryptoCard key={cryptoData.id} cryptoData={cryptoData} />
          ))
        : null}
    </div>
  );
};

export default CryptoCards;
