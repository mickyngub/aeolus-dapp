import { useRouter } from "next/router";
import { ReactElement } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "twin.macro";
import Layout from "~/src/ui/layout/Layout";
import Button from "~/src/ui/button/Button";
import { fetcher } from "../api/hello";
import useSWR, { SWRConfig } from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Create labels for line graph
const labels = new Array(7).fill("");

export async function getStaticPaths() {
  const cryptos: CryptoData[] = await fetcher(
    process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
      ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO_TOP_TEN
      : "/"
  );
  return {
    paths: cryptos.map((crypto) => ({
      params: {
        crypto: crypto.id.toString(),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: {
    crypto: string;
  };
}) {
  const cryptoAPI =
    process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO + params.crypto;
  const cryptoData: CryptoData = await fetcher(
    process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO ? cryptoAPI : "/"
  );

  return {
    props: {
      fallback: {
        [cryptoAPI]: cryptoData,
      },
      cryptoAPI,
    },
  };
}

const Crypto = ({
  fallback,
  cryptoAPI,
}: {
  [key: string]: any;
  cryptoAPI: string;
}) => {
  const { data: cryptoData }: { data?: CryptoData[] } = useSWR(
    cryptoAPI,
    fetcher
  );
  const crypto = cryptoData ? cryptoData[0] : null;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "7D Price Change",
      },
    },
  };
  const graphData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: crypto?.sparkline_in_7d.price.filter(
          (crypto, index) => index % 24 === 24 - 1
        ),
        borderColor: "hsl(18deg 75% 55%)",
        backgroundColor: "hsl(0deg 0% 100%)",
      },
    ],
  };
  return (
    <SWRConfig value={{ fallback }}>
      <div tw="min-h-full bg-primary bg-noise">
        <div tw="w-9/12 mx-auto">
          <Link href="/protocol">
            <a>
              <Button size="small">Back</Button>
            </a>
          </Link>
          <p>{crypto?.name}</p>
          <img src={crypto?.image} alt={crypto?.name + " image"} tw="w-12" />
          <p>Current Price - {crypto?.current_price}</p>
          <p>24h Change - {crypto?.price_change_percentage_24h.toFixed(2)}%</p>
          <p>Last Update - {crypto?.last_updated}</p>
          <Line data={graphData} options={options} />
        </div>
      </div>
    </SWRConfig>
  );
};

Crypto.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Crypto;
