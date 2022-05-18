import { useRouter } from "next/router";
import {
  ChangeEvent,
  ReactElement,
  Suspense,
  useState,
  useEffect,
} from "react";
import Loading from "~/src/ui/loading/Loading";
import Layout from "~/src/ui/layout/Layout";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import "twin.macro";
import Link from "next/link";
import Button from "~/src/ui/button/Button";
import useSWR from "swr";
import { fetcher } from "~/pages/api";
import PairCard from "~/src/protocol/PairCards/PairCard/PairCard";
import { findPairInPairDataArray } from "~/src/pair/utils";
import {
  MoralisContextValue,
  useMoralis,
  useWeb3Contract,
} from "react-moralis";
import { toast } from "react-toastify";
import deployedContract from "~/src/deployments/contract.json";
import aeolusRouterABI from "~/src/abi/periphery/AeolusRouter.sol/AeolusRouter.json";
import aeolusPairABI from "~/src/abi/core/AeolusPair.sol/AeolusPair.json";
import ERC20ABI from "~/src/abi/ERC20/ERC20.sol/ERC20.json";
import { ethers } from "ethers";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  : "/";

const PairID = () => {
  const {
    account,
    isAuthenticated,
    enableWeb3,
    user,
    web3,
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
          pair.pairName as keyof typeof deployedContract.AeolusLPTokens
        ].address
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
  }, [isWeb3Enabled, runGetLPOfPairSymbol]);

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
            <p tw="text-center text-5xl text-white">AEOLUS PAIR</p>
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
                  <div tw=" hover:pointer-events-none">
                    {<PairCard pairData={pair}></PairCard>}
                  </div>
                  <div tw="flex flex-col items-end justify-between gap-4">
                    <p>Current LP of {pair.pairName}</p>
                    <div>
                      <p>AeolusPair Address</p>
                      <a
                        href={`https://snowtrace.io/${pair.pairAddress}`}
                        target="_blank"
                        rel="noopener noreferer noreferrer"
                      >
                        {pair.pairAddress}
                      </a>
                    </div>
                    <p>Invest Amount in USDT.e</p>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={handleInputChange}
                      placeholder="Invest Amount"
                      tw="border-2 border-secondary bg-white bg-noise text-right ring-2 ring-white focus-visible:outline-none"
                    />
                    <p>
                      Estimated Amount of {pair.token0}:
                      {(
                        investAmount /
                        2 /
                        crypto0Data[0].current_price
                      ).toFixed(10)}
                    </p>
                    <p>
                      Estimated Amount of {pair.token1}:
                      {(
                        investAmount /
                        2 /
                        crypto1Data[0].current_price
                      ).toFixed(10)}
                    </p>
                    {runGetApprovedUSDTDotEData?._hex === "0x00" ? (
                      <Button size="small" onClick={runApproveUSDTDotE}>
                        Approve Token
                      </Button>
                    ) : runGetLPOfPairSymbolData?.hex === "0x00" ? (
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
              )}
            </>
          ) : (
            <div tw="h-80 grid place-content-center">
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
