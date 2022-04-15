import type { ReactElement } from "react";
import Layout from "~/ui/layout/Layout";

const Protocol = () => {
  return <div>Protocol</div>;
};

Protocol.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Protocol;
