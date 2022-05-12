import React from "react";
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
import dayjs from "dayjs";

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
    <div tw="transition-duration[300ms] h-full w-56 border-2 border-white hover:opacity-70">
      <div tw="flex items-center gap-2 border-b-2 border-white bg-accent-400 p-2 text-white ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cryptoData.image}
          alt={cryptoData.name + " image"}
          tw="h-12 w-12"
        />
        <p tw="text-lg">{cryptoData.name}</p>
      </div>
      <div tw="border-2 border-accent-400 bg-white bg-noise ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div tw="flex flex-col gap-2 p-2">
          <p tw="text-sm">
            Current Price:{" "}
            <span>&nbsp;${cryptoData.current_price.toFixed(2)}</span>
          </p>
          {/* <p>{cryptoData.sparkline_in_7d.price}</p> */}
          <p tw="text-sm">
            24h Change:
            <span tw="text-base">
              &nbsp;{cryptoData.price_change_percentage_24h.toFixed(2)}%
            </span>
          </p>
          {/* <p>
            {cryptoData.sparkline_in_7d.price.map((priceData) => (
              <p>{priceData.toFixed(2)}</p>
            ))}
          </p> */}
          <p tw="text-sm">
            Last Update:<span>&nbsp;{cryptoData.last_updated}</span>
          </p>
        </div>
        <div tw="mx-auto w-52">
          <Line data={graphData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
