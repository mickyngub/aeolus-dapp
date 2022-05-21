import { Suspense } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import "twin.macro";
import styled from "styled-components";

import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Button from "~/src/ui/button/Button";
import Loading from "~/src/ui/loading/Loading";

const Home: NextPage = () => {
  return (
    <div tw="min-h-full bg-primary bg-noise py-6">
      <Head>
        <title>Aeolus</title>
        <meta name="description" content="Aeolus dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Suspense
        fallback={
          <div tw="absolute top-0 bottom-0 right-0 left-0 m-auto grid h-32 w-32 place-content-center  ">
            <Loading />
          </div>
        }
      >
        <main tw="">
          <p tw="px-8 text-xl font-bold">
            Earn extra yield on you invested funds
          </p>
          <WrapperCanvas>
            <CanvasWind lightIntensity={0} />
          </WrapperCanvas>
          <div tw="my-8 text-center">
            <h1 tw="p-4 text-8xl font-bold">AEOLUS PROTOCOL</h1>
            <p tw="mt-4 px-4">
              Earn additional yield on top of your invested fund in a
              decentralized, trustless, and permissionless approach.
            </p>
            <p tw="px-4">The future of passive investment begins now.</p>
          </div>
          <div tw="my-8 flex justify-center">
            <Link href="/main">
              <a>
                <Button size="small">Get Started</Button>
              </a>
            </Link>
          </div>
          <WrapperCanvas>
            <CanvasWind lightIntensity={0} />
          </WrapperCanvas>
          <p tw="px-8 text-right text-xl font-bold">
            Optimize your investment in one-click
          </p>
        </main>
      </Suspense>
    </div>
  );
};

const WrapperCanvas = styled.div`
  height: 150px;
  border-top-width: 2px;
  border-bottom-width: 2px;
  border-color: white;
`;

export default Home;
