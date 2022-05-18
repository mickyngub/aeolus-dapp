import React from "react";
import "twin.macro";
import listTokens from "~/src/deployments/contract.json";

interface Props {
  userERC20Balances:
    | {
        token_address: string;
        name: string;
        symbol: string;
        logo?: string | undefined;
        thumbnail?: string | undefined;
        decimals: string;
        balance: string;
      }[]
    | null;
  userNativeBalance: {
    balance: string | undefined;
    formatted: string | null;
  };
}

interface ERC20Balance {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: string;
  balance: string;
}

const Dashboard = ({ userERC20Balances, userNativeBalance }: Props) => {
  const listStableTokens: { address: string }[] = Object.values(
    listTokens.AVAXStableTokens
  );
  const listAeolusLPTokens: { address: string }[] = Object.values(
    listTokens.AeolusLPTokens
  );
  const stableTokenBalances: ERC20Balance[] = [];
  const aeolusLPTokenBalances: ERC20Balance[] = [];
  if (userERC20Balances) {
    for (let i = 0; i < userERC20Balances.length; i++) {
      for (
        let k = 0;
        k < Math.max(listStableTokens.length, listAeolusLPTokens.length);
        k++
      ) {
        if (k < listStableTokens.length) {
          if (
            userERC20Balances[i].token_address.toLowerCase() ===
            listStableTokens[k].address.toLowerCase()
          ) {
            stableTokenBalances.push(userERC20Balances[i]);
          }
        }
        if (k < listAeolusLPTokens.length) {
          if (
            userERC20Balances[i].token_address.toLowerCase() ===
            listAeolusLPTokens[k].address.toLowerCase()
          ) {
            aeolusLPTokenBalances.push(userERC20Balances[i]);
          }
        }
      }
    }
  }

  return (
    <div tw="border-2 border-secondary">
      <p tw="border-b-2 border-secondary bg-accent-400 bg-noise p-4 text-3xl font-bold text-white">
        Dashboard
      </p>
      <div tw="border-t-2 border-b-2 border-secondary bg-white bg-noise">
        <div tw="m-4">
          <p tw="my-6 text-xl">My Position</p>
          <div tw="grid grid-cols-2 gap-4">
            <div>
              {stableTokenBalances.map((stableTokenBalance) => {
                return (
                  <p key={stableTokenBalance.symbol}>
                    <p>STABLE TOKEN</p>
                    {stableTokenBalance.symbol} {stableTokenBalance.balance}
                  </p>
                );
              })}
            </div>
            <div>
              {aeolusLPTokenBalances.map((aeolusLPTokenBalance) => {
                return (
                  <p key={aeolusLPTokenBalance.symbol}>
                    <p>LP TOKEN</p>
                    {aeolusLPTokenBalance.symbol} {aeolusLPTokenBalance.balance}
                  </p>
                );
              })}
            </div>
            <div>
              <p>AVAX TOKEN</p>AVAX Balances {userNativeBalance.balance}
            </div>
          </div>
        </div>
      </div>
      <div tw="grid grid-cols-2 gap-4 bg-white bg-noise p-4"></div>
    </div>
  );
};

export default Dashboard;
