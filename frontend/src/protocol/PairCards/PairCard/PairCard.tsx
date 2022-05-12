import React from "react";
import "twin.macro";

interface Props {
  pairData: Pair;
}

const PairCard = ({ pairData }: Props) => {
  return (
    <div tw="transition-duration[300ms] h-full w-56 border-2 border-white hover:opacity-70">
      <div tw="flex items-center gap-2 border-b-2 border-white bg-accent-500  p-2 text-white ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src={cryptoData.image}
          alt={cryptoData.name + " image"}
          tw="h-12 w-12"
        /> */}
        <p tw="text-lg">{pairData.pairName}</p>
      </div>
      <div tw="border-2 border-accent-500 bg-white bg-noise ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div tw="flex flex-col gap-2 p-2">
          <p tw="text-sm">Ratio: {pairData.ratio}</p>
          <p tw="text-sm">
            {pairData.token0} Current Price: <span>&nbsp;$</span>
          </p>
          <p tw="text-sm">
            {pairData.token1} Current Price: <span>&nbsp;$</span>
          </p>
        </div>
      </div>
    </div>
    // <div tw="h-56 w-56 border-2 border-white">
    //   BTC / BNB / SOL
    //   <div>
    //     <p>Ratio 0.333 : 0.333 : 0.333</p>
    //   </div>
    // </div>
  );
};

export default PairCard;
