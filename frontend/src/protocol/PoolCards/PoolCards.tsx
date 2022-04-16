import React from "react";
import Link from "next/link";
import PoolCard from "./PoolCard/PoolCard";
import "twin.macro";

const poolCards = [
  { name: "Bitcoin-USDT", url: "BTC-USDT" },
  { name: "Ethereum-BNB-USDT", url: "ETH-BNB-USDT" },
];

const PoolCards = () => {
  return (
    <div id="#pool" tw="flex gap-4 ">
      {poolCards
        ? poolCards.map((poolCard) => {
            return (
              <Link href={`/pool/${poolCard.url}`} key={poolCard.name}>
                <a>
                  <PoolCard />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default PoolCards;
