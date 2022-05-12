import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
// import GlobalStyles from "../styles/GlobalStyles";
import GlobalStyles from "~/styles/GlobalStyles";
import { MoralisProvider } from "react-moralis";

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
        <div>
          <GlobalStyles />
          <Component {...pageProps} />
        </div>
      )}
    </MoralisProvider>
  );
}

export default MyApp;
