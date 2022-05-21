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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface Props {
  cryptoData: CryptoData;
}

// Create labels for line graph
const labels = new Array(14).fill("");

const CryptoCard = ({ cryptoData }: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "14D Price Change",
      },
    },
    tension: 0.5,
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };
  const graphData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: cryptoData.sparkline_in_7d.price.filter(
          (cryptoData, index) => index % 12 === 12 - 1
        ),
        borderColor: "hsl(18deg 75% 55%)",
        backgroundColor: "hsl(0deg 0% 100%)",
      },
    ],
  };

  return (
    <div tw="transition-duration[300ms] h-full w-56 border-2 border-white hover:translate-x-0.5 hover:-translate-y-1 hover:cursor-default hover:opacity-80">
      <div tw="flex items-center gap-2 border-b-2 border-white bg-secondary bg-noise p-2 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cryptoData.image}
          alt={cryptoData.name + " image"}
          tw="h-12 w-12"
        />
        <p tw="max-h-12 text-lg">
          {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
        </p>
      </div>
      <div tw="border-2 border-secondary bg-white bg-noise">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div tw="flex flex-col gap-2 p-2">
          <div tw="my-2">
            <p tw="flex justify-between text-sm">
              <span>♔ &nbsp;Market Cap Rank:</span>{" "}
              <span>&nbsp;{cryptoData.market_cap_rank}</span>
            </p>
            <p tw="flex justify-between text-sm font-bold">
              <span>∇ &nbsp;Current Price:</span>
              <span>&nbsp;${cryptoData.current_price}</span>
            </p>
          </div>
          <div tw="my-1">
            <p tw="flex justify-between text-sm">
              <span>↑ &nbsp;24h High:</span>
              <span>&nbsp;${cryptoData.high_24h}</span>
            </p>{" "}
            <p tw="flex justify-between text-sm">
              <span>↓ &nbsp;24h Low:</span>
              <span>&nbsp;${cryptoData.low_24h}</span>
            </p>
            <p tw="flex justify-between text-sm">
              <span>Δ 24h Change:</span>
              <span>
                &nbsp;{cryptoData.price_change_percentage_24h.toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
        <div tw="mx-auto w-52">
          <Line data={graphData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
