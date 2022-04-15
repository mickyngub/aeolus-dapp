import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import tw from "twin.macro";
import styled from "styled-components";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Button from "~/src/ui/button/Button";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div tw="h-full bg-primary py-6">
      <Head>
        <title>Aeolus</title>
        <meta name="description" content="Aeolus dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main tw="">
        <p tw="text-xl font-bold px-8">
          The best yield optimizer on AVAX chain
        </p>
        <WrapperCanvas>
          <CanvasWind />
        </WrapperCanvas>
        <div tw="text-center my-8">
          <h1 tw="font-bold text-8xl ">AEOLUS PROTOCOL</h1>
          <p tw="px-4 mt-4">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus,
            asperiores possimus in, ratione accusantium quisquam exercitationem
            laborum libero qui molestias ut fugiat reiciendis cumque dolore sunt
            rerum. Perferendis, quisquam voluptate?
          </p>
        </div>

        <div tw="flex justify-center my-8">
          <Link href="/main">
            <a>
              <Button size="medium">Get Started</Button>
            </a>
          </Link>
        </div>

        <WrapperCanvas>
          <CanvasWind />
        </WrapperCanvas>
        <p tw="text-xl font-bold px-8 text-right">
          Optimize your investment in one-click
        </p>
      </main>
    </div>
  );
};

const WrapperCanvas = styled.div`
  height: 150px;
`;

export default Home;
