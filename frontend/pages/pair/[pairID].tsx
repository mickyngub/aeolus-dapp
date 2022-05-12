import { useRouter } from "next/router";
import { ReactElement, Suspense } from "react";
import Loading from "~/src/ui/loading/Loading";
import Layout from "~/src/ui/layout/Layout";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import "twin.macro";
import Link from "next/link";
import Button from "~/src/ui/button/Button";
import useSWR from "swr";
import { fetcher } from "~/pages/api/hello";
import PairCard from "~/src/protocol/PairCards/PairCard/PairCard";
import { findPairInPairDataArray } from "~/src/pair/utils";

const coinGeckoAPI = process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
  : "/";

const PairID = () => {
  let pair;
  const router = useRouter();
  const { pairID } = router.query;
  typeof pairID === "string" && (pair = findPairInPairDataArray(pairID));
  const { data: crypto0Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + (pair && pair.token0ID),
    fetcher
  );
  const { data: crypto1Data }: { data?: CryptoData[] } = useSWR(
    coinGeckoAPI + (pair && pair.token1ID),
    fetcher
  );

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
      <div tw="pb-4">
        <div tw="relative top-0 w-full border-t-2 border-b-2 border-white">
          <CanvasWind lightIntensity={0.5} />
          <div tw="absolute bottom-0 px-28 pb-2">
            <p tw="text-center text-5xl text-white ">AEOLUS PAIR</p>
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

          {pair && <PairCard pairData={pair}></PairCard>}
        </div>
      </div>
    </Suspense>
  );
};

PairID.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PairID;
