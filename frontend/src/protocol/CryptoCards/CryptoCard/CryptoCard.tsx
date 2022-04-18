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
const labels = new Array(7).fill("");

const CryptoCard = ({ cryptoData }: Props) => {
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
    tension: 0.3,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
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
          (cryptoData, index) => index % 24 === 24 - 1
        ),
        borderColor: "hsl(18deg 75% 55%)",
        backgroundColor: "hsl(0deg 0% 100%)",
      },
    ],
  };

  return (
    <div tw="border-2 border-white w-96 h-80">
      <p>
        {cryptoData.market_cap_rank} - {cryptoData.name}
      </p>
      <img src={cryptoData.image} alt={cryptoData.name + " image"} tw="w-12" />
      <p>Current Price - ${cryptoData.current_price}</p>
      {/* <p>{cryptoData.sparkline_in_7d.price}</p> */}
      <p>24h Change - {cryptoData.price_change_percentage_24h.toFixed(2)}%</p>
      {/* <p>
        {cryptoData.sparkline_in_7d.price.map((priceData) => (
          <p>{priceData.toFixed(2)}</p>
        ))}
      </p> */}

      <p>{cryptoData.last_updated}</p>
      <div tw="w-11/12 mx-auto">
        <Line data={graphData} options={options} />
      </div>
    </div>
  );
};

export default CryptoCard;
