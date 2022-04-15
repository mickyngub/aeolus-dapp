import type { ReactElement } from "react";
import "twin.macro";
import Dashboard from "~/src/protocol/Dashboard";
import PoolCard from "~/src/protocol/PoolCard";
import PriceChart from "~/src/protocol/PriceChart";
import Layout from "~/src/ui/layout/Layout";

const Protocol = () => {
  return (
    <div tw="bg-primary">
      <div tw="p-6">
        <Dashboard />
      </div>
      <div tw="p-6">
        <PriceChart />
      </div>
      <div tw="p-6">
        <PoolCard />
      </div>
    </div>
  );
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Protocol;
