import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import tw from "twin.macro";
import styled from "styled-components";
import CanvasWind from "~/ui/canvasWind/CanvasWind";
import Button from "~/ui/button/Button";

const Home: NextPage = () => {
  return (
    <div tw="h-full bg-primary">
      <Head>
        <title>Aeolus</title>
        <meta name="description" content="Aeolus dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main tw="py-8">
        <p tw="text-xl font-bold px-8">
          The best yield optimizer on AVAX chain
        </p>
        <WrapperCanvas>
          <CanvasWind />
        </WrapperCanvas>
        <p tw="text-xl font-bold text-right px-8">Find the best yield here</p>
        <h1 tw="font-bold text-7xl text-center mb-8">AEOLUS PROTOCOL</h1>

        <p tw="text-xl font-bold px-8">Optimize your investment in one-click</p>
        <WrapperCanvas>
          <CanvasWind />
        </WrapperCanvas>
        <div>
          <Button>Get Started</Button>
        </div>
      </main>
    </div>
  );
};

const WrapperCanvas = styled.div`
  height: 150px;
`;

export default Home;
