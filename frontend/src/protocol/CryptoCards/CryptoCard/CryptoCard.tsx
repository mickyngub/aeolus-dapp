import React from "react";
import "twin.macro";

interface Props {
  cryptoData: CryptoData;
}
const CryptoCard = ({ cryptoData }: Props) => {
  return (
    <div tw="border-2 border-white w-52 h-56 overflow-auto">
      <p>
        {cryptoData.market_cap_rank} {cryptoData.name}
      </p>
      <p></p>
      <img src={cryptoData.image} alt={cryptoData.name + " image"} tw="w-12" />
      <p>${cryptoData.current_price}</p>
      {/* <p>{cryptoData.sparkline_in_7d.price}</p> */}
      <p>{cryptoData.price_change_percentage_24h.toFixed(2)}%</p>
      <p>
        {cryptoData.sparkline_in_7d.price.map((priceData) => (
          <p>{priceData.toFixed(2)}</p>
        ))}
      </p>
    </div>
  );
};

export default CryptoCard;
