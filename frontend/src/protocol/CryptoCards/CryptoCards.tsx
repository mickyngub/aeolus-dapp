import Link from "next/link";
import CryptoCard from "./CryptoCard/CryptoCard";
import "twin.macro";
import useSWR from "swr";
import { fetcher } from "~/pages/api/hello";

const cryptoCards = [
  {
    name: "Bitcoin",
    url: "bitcoin",
  },
  { name: "Ethereum", url: "ethereum" },
  { name: "Solana", url: "solana" },
];
const coinGeckoAPI = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;

const CryptoCards = () => {
  const { data: cryptoDatas, error } = useSWR(coinGeckoAPI, fetcher);
  return (
    <div id="#cryptoMarket" tw="flex gap-4">
      {cryptoDatas && cryptoDatas[0].id}
      {cryptoDatas
        ? cryptoDatas.map((cryptoData: any) => {
            return (
              <Link href={`/crypto/${cryptoData.id}`} key={cryptoData.name}>
                <a>
                  <CryptoCard cryptoName={cryptoData.name} />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default CryptoCards;
