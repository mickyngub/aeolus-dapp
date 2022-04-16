import Link from "next/link";
import CryptoCard from "./CryptoCard/CryptoCard";
import "twin.macro";

const cryptoCards = [
  {
    name: "Bitcoin",
    url: "bitcoin",
  },
  { name: "Ethereum", url: "ethereum" },
  { name: "Solana", url: "solana" },
];

const CryptoCards = () => {
  return (
    <div id="#cryptoMarket" tw="flex gap-4">
      {cryptoCards
        ? cryptoCards.map((cryptoCard) => {
            return (
              <Link href={`/crypto/${cryptoCard.url}`} key={cryptoCard.name}>
                <a>
                  <CryptoCard />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default CryptoCards;
