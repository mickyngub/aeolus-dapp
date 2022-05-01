import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import "twin.macro";
import styled from "styled-components";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Button from "~/src/ui/button/Button";
import Link from "next/link";
import { Suspense } from "react";
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
          <div tw="h-32 w-32 absolute top-0 bottom-0 right-0 left-0 m-auto grid place-content-center  ">
            <Loading />
          </div>
        }
      >
        <main tw="">
          <p tw="text-xl font-bold px-8">
            Earn extra yield on you invested funds
          </p>
          <WrapperCanvas>
            <CanvasWind lightIntensity={0} />
          </WrapperCanvas>
          <div tw="text-center my-8">
            <h1 tw="font-bold text-8xl ">AEOLUS PROTOCOL</h1>
            <p tw="px-4 mt-4">
              Earn additional yield on top of your invested fund in a
              decentralized, trustless, and permissionless approach.
            </p>
            <p tw="px-4">The future of passive investment begins now.</p>
          </div>
          <div tw="flex justify-center my-8">
            <Link href="/main">
              <a>
                <Button size="medium">Get Started</Button>
              </a>
            </Link>
          </div>
          <WrapperCanvas>
            <CanvasWind lightIntensity={0} />
          </WrapperCanvas>
          <p tw="text-xl font-bold px-8 text-right">
            Optimize your investment in one-click
          </p>
        </main>
      </Suspense>
    </div>
  );
};

const WrapperCanvas = styled.div`
  height: 150px;
`;

export default Home;
