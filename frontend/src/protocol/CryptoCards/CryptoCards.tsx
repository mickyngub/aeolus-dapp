import Link from "next/link";
import CryptoCard from "./CryptoCard/CryptoCard";
import "twin.macro";
import useSWR from "swr";
import { fetcher } from "~/pages/api/hello";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
  : "/";

const CryptoCards = () => {
  const { data: cryptoDatas }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI,
    fetcher
  );
  return (
    <div id="#cryptoMarket" tw="flex flex-wrap gap-4">
      {cryptoDatas
        ? cryptoDatas.map((cryptoData) => {
            return (
              <Link
                href={{
                  pathname: `/crypto/${cryptoData.id}`,
                }}
                key={cryptoData.name}
              >
                <a>
                  <CryptoCard cryptoData={cryptoData} />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default CryptoCards;
