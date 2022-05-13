import React from "react";
import "twin.macro";
import useContract from "../hooks/useContract";

const Dashboard = () => {
  return (
    <div tw="border-2 border-secondary">
      <p tw="border-b-2 border-secondary bg-accent-400 bg-noise p-4 text-3xl font-bold text-white">
        Dashboard
      </p>
      <div tw="border-t-2 border-b-2 border-secondary bg-white bg-noise">
        <div tw="m-4">
          <p tw="my-6 text-xl">My Position</p>
          <div tw="grid grid-cols-2 gap-4">
            <p>WBTC.e-WETH.e:</p>
            <p>SOL-LUNA:</p>
            <p>NEAR-BAND:</p>
            <p>WETH.e-SHIBA:</p>
          </div>
        </div>
      </div>
      <div tw="grid grid-cols-2 gap-4 bg-white bg-noise p-4">
        <p tw="text-lg">AVAX Balances</p>
        <p tw="text-lg">USDT.e Balances</p>
        <p tw="text-lg">USDC.e Balances</p>
        <p tw="text-lg">MIM Balances</p>
      </div>
    </div>
  );
};

export default Dashboard;
