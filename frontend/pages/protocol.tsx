import type { ReactElement } from "react";
import Layout from "~/src/ui/layout/Layout";

const Protocol = () => {
  return <div>Protocol</div>;
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Protocol;
