import React from "react";
import "twin.macro";

interface Props {
  cryptoName: string;
}
const CryptoCard = ({ cryptoName }: Props) => {
  return <div tw="border-2 border-white w-52 h-56">{cryptoName}</div>;
};

export default CryptoCard;
