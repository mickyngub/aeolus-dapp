import React from "react";
import Link from "next/link";
import PairCard from "./PairCard/PairCard";
import { pairDataArray } from "./PairCard/PairData";
import "twin.macro";

const PairCards = () => {
  return (
    <div id="#pair" tw="grid grid-cols-4 place-items-center gap-6">
      {pairDataArray
        ? pairDataArray.map((pair) => {
            return (
              <Link href={`/pair/${pair.pairID}`} key={pair.pairName}>
                <a>
                  <PairCard pairData={pair} />
                </a>
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default PairCards;
