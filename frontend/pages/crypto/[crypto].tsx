import { useRouter } from "next/router";
import { ReactElement } from "react";
import Layout from "~/src/ui/layout/Layout";
import "twin.macro";
import { fetcher } from "../api/hello";

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
  const cryptoData: CryptoData = await fetcher(
    process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO
      ? process.env.NEXT_PUBLIC_API_COINGECKO_CRYPTO + params.crypto
      : "/"
  );
  return {
    props: {
      cryptoData,
    },
  };
}

const Crypto = ({ cryptoData }: { cryptoData: CryptoData }) => {
  const router = useRouter();
  const { crypto } = router.query;
  return <div tw="bg-primary bg-noise">{crypto}</div>;
};

Crypto.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Crypto;
