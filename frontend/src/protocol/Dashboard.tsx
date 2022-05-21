import "twin.macro";
import { ethers } from "ethers";

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
  isFetchingData: boolean;
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
const listStableTokens: { address: string }[] = Object.values(
  listTokens.AVAXStableTokens
);
const listAeolusLPTokens: { address: string }[] = Object.values(
  listTokens.AeolusLPTokens
);

const Dashboard = ({
  userERC20Balances,
  userNativeBalance,
  isFetchingData,
}: Props) => {
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
    <div tw="my-8 flex items-stretch gap-4">
      <p tw="flex max-w-max items-center border-2 border-white bg-secondary p-4 text-2xl font-bold">
        Dashboard
      </p>
      <div tw="transition-duration[400ms] border-2 border-white bg-accent-500 p-4 text-center transition-all hover:scale-105 hover:opacity-90">
        <p tw="text-lg text-white">♖ Avalanche (AVAX)</p>
        {userNativeBalance.formatted ? userNativeBalance.formatted : "-"}
      </div>
      <div tw="transition-duration[400ms] border-2 border-white bg-secondary bg-noise p-4 text-center transition-all hover:scale-105 hover:opacity-90">
        <p tw="text-lg text-white">♗ STABLE COINS</p>
        {stableTokenBalances.length !== 0
          ? stableTokenBalances.map((stableTokenBalance) => {
              return (
                <div key={stableTokenBalance.symbol}>
                  {ethers.utils.formatUnits(stableTokenBalance.balance, 6)}{" "}
                  {stableTokenBalance.symbol}
                </div>
              );
            })
          : "-"}
      </div>
      <div tw="transition-duration[400ms] border-2 border-white bg-accent-500 p-4 text-center transition-all hover:scale-105 hover:opacity-90">
        <p tw="text-lg text-white">♘ Aeolus LP TOKEN</p>

        {aeolusLPTokenBalances.length !== 0
          ? aeolusLPTokenBalances.map((aeolusLPTokenBalance) => {
              return (
                <div key={aeolusLPTokenBalance.symbol}>
                  {ethers.utils.formatEther(aeolusLPTokenBalance.balance)}{" "}
                  {aeolusLPTokenBalance.symbol} LP
                </div>
              );
            })
          : "-"}
      </div>
    </div>
  );
};

export default Dashboard;
