import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import "animate.css/animate.min.css";

import GlobalStyles from "~/styles/GlobalStyles";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <MoralisProvider
      appId={
        process.env.NEXT_PUBLIC_APP_ID ? process.env.NEXT_PUBLIC_APP_ID : ""
      }
      serverUrl={
        process.env.NEXT_PUBLIC_SERVER_URL
          ? process.env.NEXT_PUBLIC_SERVER_URL
          : ""
      }
    >
      {getLayout(
        <>
          <GlobalStyles />
          <Component {...pageProps} />
        </>
      )}
    </MoralisProvider>
  );
}

export default MyApp;
