import React from "react";
import "twin.macro";

const PoolCard = () => {
  return (
    <div tw="border-2 border-white w-56 h-56">
      BTC / BNB / SOL
      <div>
        <p>Ratio 0.333 : 0.333 : 0.333</p>
      </div>
    </div>
  );
};

export default PoolCard;
