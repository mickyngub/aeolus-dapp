import type { ReactElement } from "react";
import Layout from "~/ui/layout/Layout";

const Main = () => {
  return <div>This is mainmain</div>;
};

Main.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Main;
