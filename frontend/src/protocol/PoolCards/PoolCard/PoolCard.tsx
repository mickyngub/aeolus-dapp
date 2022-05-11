import React from "react";
import "twin.macro";

const PoolCard = () => {
  return (
    <div tw="h-56 w-56 border-2 border-white">
      BTC / BNB / SOL
      <div>
        <p>Ratio 0.333 : 0.333 : 0.333</p>
      </div>
    </div>
  );
};

export default PoolCard;
