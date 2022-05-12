import React from "react";
import Link from "next/link";
import PairCard from "./PairCard/PairCard";
import "twin.macro";

const pairCards = [
  { name: "Bitcoin-USDT", url: "BTC-USDT" },
  { name: "Ethereum-BNB-USDT", url: "ETH-BNB-USDT" },
];

const PairCards = () => {
  return (
    <div id="#pair" tw="flex gap-4 ">
      {pairCards
        ? pairCards.map((pairCard) => {
            return (
              <Link href={`/pair/${pairCard.url}`} key={pairCard.name}>
                <a>
                  <PairCard />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default PairCards;
