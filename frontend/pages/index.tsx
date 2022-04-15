import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import tw from "twin.macro";

const Home: NextPage = () => {
  return (
    <div tw="h-full bg-blue-500">
      <Head>
        <title>Aeolus</title>
        <meta name="description" content="Aeolus dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 tw=" font-bold text-8xl">AEOLUS PROTOCOL</h1>
      </main>
    </div>
  );
};

export default Home;
