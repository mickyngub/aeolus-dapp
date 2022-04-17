import Link from "next/link";
import CryptoCard from "./CryptoCard/CryptoCard";
import "twin.macro";
import useSWR from "swr";
import { fetcher } from "~/pages/api/hello";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO
  ? process.env.NEXT_PUBLIC_API_COINGECKO
  : "/";

const CryptoCards = () => {
  const { data: cryptoDatas }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI,
    fetcher
  );
  return (
    <div id="#cryptoMarket" tw="flex gap-4 flex-wrap">
      {cryptoDatas
        ? cryptoDatas.map((cryptoData) => {
            return (
              <Link href={`/crypto/${cryptoData.id}`} key={cryptoData.name}>
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
