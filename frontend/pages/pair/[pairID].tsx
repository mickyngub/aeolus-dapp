import {
  ChangeEvent,
  ReactElement,
  Suspense,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "twin.macro";
import useSWR from "swr";
import {
  MoralisContextValue,
  useMoralis,
  useWeb3Contract,
} from "react-moralis";
import { ethers } from "ethers";

import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Loading from "~/src/ui/loading/Loading";
import Layout from "~/src/ui/layout/Layout";
import Button from "~/src/ui/button/Button";
import { fetcher } from "~/pages/api";
import PairCard from "~/src/protocol/PairCards/PairCard/PairCard";
import { findPairInPairDataArray } from "~/src/pair/utils";
import deployedContract from "~/src/deployments/contract.json";
import aeolusRouterABI from "~/src/abi/periphery/AeolusRouter.sol/AeolusRouter.json";
import aeolusPairABI from "~/src/abi/core/AeolusPair.sol/AeolusPair.json";
import ERC20ABI from "~/src/abi/ERC20/ERC20.sol/ERC20.json";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  : "/";

const PairID = () => {
  const {
    isAuthenticated,
    enableWeb3,
    user,
    isWeb3Enabled,
  }: MoralisContextValue = useMoralis();

  const [investAmount, setInvestAmount] = useState<number>(0);
  const [dbAddress, setDBAddress] = useState(user?.get("ethAddress"));
  const [pair, setPair] = useState<Pair | undefined>();
  const [aeolusPairAddress, setAeolusPairAddress] = useState("");

  const router = useRouter();
  const { pairID } = router.query;
  const { data: crypto0Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + (pair && pair.token0ID),
    fetcher
  );
  const { data: crypto1Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + (pair && pair.token1ID),
    fetcher
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value, 10);
    if (inputValue < 0 || inputValue > 10000) return;
    setInvestAmount(inputValue);
  };
  const {
    data: runGetLPOfPairSymbolData,
    error: runGetLPOfPairSymbolError,
    runContractFunction: runGetLPOfPairSymbol,
  }: any = useWeb3Contract({
    abi: aeolusPairABI,
    contractAddress: aeolusPairAddress,
    functionName: "addressToAmountInvest",
    params: {
      "": dbAddress,
    },
  });

  const {
    data: runGetApprovedUSDTDotEData,
    error: runGetApprovedUSDTDotEError,
    runContractFunction: runGetApprovedUSDTDotE,
  }: any = useWeb3Contract({
    abi: ERC20ABI,
    contractAddress: deployedContract.AVAXStableTokens["USDT.e"].address,
    functionName: "allowance",
    params: {
      owner: dbAddress,
      spender: deployedContract.AeolusRouter.address,
    },
  });

  const { runContractFunction: runApproveUSDTDotE } = useWeb3Contract({
    abi: ERC20ABI,
    contractAddress: deployedContract.AVAXStableTokens["USDT.e"].address,
    functionName: "approve",
    params: {
      spender: deployedContract.AeolusRouter.address,
      amount: ethers.constants.MaxUint256,
    },
  });

  const { error: runInvestPairError, runContractFunction: runInvestPair }: any =
    useWeb3Contract({
      abi: aeolusRouterABI,
      contractAddress: deployedContract.AeolusRouter.address,
      functionName: "investPair",
      params: {
        pairID: 1,
        amountInvest:
          investAmount && ethers.utils.parseUnits(investAmount.toString(), 6),
      },
    });

  const { error: runRedeemPairError, runContractFunction: runRedeemPair }: any =
    useWeb3Contract({
      abi: aeolusRouterABI,
      contractAddress: deployedContract.AeolusRouter.address,
      functionName: "redeemPair",
      params: {
        pairID: 1,
      },
    });

  useEffect(() => {
    setDBAddress(user?.get("ethAddress"));
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (typeof pairID === "string") setPair(findPairInPairDataArray(pairID));
    if (pair) {
      setAeolusPairAddress(
        deployedContract.AeolusLPTokens[
          pair?.pairName as keyof typeof deployedContract.AeolusLPTokens
        ]?.address
      );
    }
  }, [pairID, pair]);

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        await runGetApprovedUSDTDotE();
        await runGetLPOfPairSymbol();
      } else {
        await enableWeb3();
      }
    })();
  }, [isWeb3Enabled, enableWeb3, runGetApprovedUSDTDotE, runGetLPOfPairSymbol]);

  console.log("get approved usdt.e data", runGetApprovedUSDTDotEData);
  console.log("LP amount", runGetLPOfPairSymbolData);
  console.log("aeoluspair address", aeolusPairAddress);
  return (
    <Suspense
      fallback={
        <div tw="min-h-full bg-primary bg-noise">
          <div tw="absolute top-0 bottom-0 right-0 left-0 m-auto grid h-32 w-32 place-content-center  ">
            <Loading />
          </div>
        </div>
      }
    >
      <div tw="pb-6">
        <div tw="relative top-0 w-full border-t-2 border-b-2 border-white">
          <CanvasWind lightIntensity={0.5} />
          <div tw="absolute bottom-0 px-28 pb-2">
            <p tw="text-center text-5xl">
              <span tw="text-white">AEOLUS PAIR </span>
              <span tw="text-black">{pair?.pairName}</span>
            </p>
          </div>
        </div>
        <div tw="px-28">
          <div tw="my-4 flex w-full items-center">
            <div tw="flex-1">
              <Link href="/protocol">
                <a>
                  <Button size="extraSmall">Back</Button>
                </a>
              </Link>
            </div>
          </div>
          {isAuthenticated ? (
            <>
              {pair && crypto0Data && crypto1Data && (
                <div tw="flex justify-between">
                  <div tw="h-full hover:pointer-events-none">
                    <PairCard pairData={pair} />
                  </div>
                  <div tw="flex flex-col items-stretch justify-start gap-4 border-2 border-secondary bg-white bg-noise p-4">
                    <div tw="flex justify-between">
                      <p>Current LP of {pair.pairName}:&nbsp;</p>
                      <p>
                        {runGetLPOfPairSymbolData
                          ? ethers.utils.formatEther(
                              runGetLPOfPairSymbolData._hex
                            )
                          : "0"}{" "}
                        LP Token
                      </p>
                    </div>
                    <div tw="flex justify-between">
                      <p>Amount Invested in USDT.e:&nbsp;</p>
                      <p>
                        {runGetLPOfPairSymbolData
                          ? ethers.utils.formatEther(
                              runGetLPOfPairSymbolData._hex
                            )
                          : "0"}{" "}
                        USDT.e
                      </p>
                    </div>
                    <div tw="flex justify-between">
                      <p>Aeolus Pair Address:&nbsp;</p>

                      <p>
                        <a
                          tw="text-underline-offset[3px] text-accent-300 underline opacity-70 hover:opacity-100"
                          href={`https://snowtrace.io/address/${pair.pairAddress}`}
                          target="_blank"
                          rel="noopener noreferer noreferrer"
                        >
                          {pair.pairAddress ? pair.pairAddress : "0x"}
                        </a>
                      </p>
                    </div>
                    {runGetLPOfPairSymbolData?._hex === "0x00" ||
                    runGetLPOfPairSymbolData?._hex === undefined ? (
                      <div>
                        <div tw="flex justify-between gap-4">
                          <p>Invest Amount in USDT.e</p>
                          <input
                            type="number"
                            value={investAmount}
                            onChange={handleInputChange}
                            placeholder="Invest Amount"
                            tw="border-2 border-secondary bg-white bg-noise text-right ring-2 ring-white focus-visible:outline-none"
                          />
                        </div>
                        {investAmount ? (
                          <>
                            <div tw="my-3 flex justify-between">
                              <p>Estimated Amount of {pair.token0}:&nbsp;</p>
                              <p>
                                {(
                                  investAmount /
                                  2 /
                                  crypto0Data[0].current_price
                                ).toFixed(8)}
                              </p>
                            </div>
                            <div tw="my-3 flex justify-between">
                              <p>Estimated Amount of {pair.token1}:&nbsp;</p>
                              <p>
                                {(
                                  investAmount /
                                  2 /
                                  crypto1Data[0].current_price
                                ).toFixed(8)}
                              </p>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <div tw="mt-4 self-end">
                      {runGetApprovedUSDTDotEData?._hex === "0x00" ? (
                        <Button size="small" onClick={runApproveUSDTDotE}>
                          Approve Token
                        </Button>
                      ) : runGetLPOfPairSymbolData?._hex === "0x00" ||
                        runGetLPOfPairSymbolData?._hex === undefined ? (
                        <>
                          <Button size="small" onClick={runInvestPair}>
                            Invest
                          </Button>
                        </>
                      ) : (
                        <Button size="small" onClick={runRedeemPair}>
                          Redeem
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div tw="grid h-80 place-content-center">
              <p tw="text-2xl">Please Login with your Metamask Wallet</p>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

PairID.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PairID;
