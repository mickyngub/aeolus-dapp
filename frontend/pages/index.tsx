import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import tw from "twin.macro";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Aeolus</title>
        <meta name="description" content="Aeolus dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 tw="bg-blue-500 font-bold">AEOLUS PROTOCOL</h1>
      </main>
    </div>
  );
};

export default Home;
