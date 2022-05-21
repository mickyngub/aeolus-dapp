import "twin.macro";
import tw from "twin.macro";
import type { ReactElement } from "react";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimationOnScroll } from "react-animation-on-scroll";

import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Loading from "~/src/ui/loading/Loading";

const Main = () => {
  return (
    <Suspense
      fallback={
        <div tw="min-h-full bg-primary bg-noise">
          <div tw="absolute top-4 bottom-0 right-0 left-0 m-auto grid h-32 w-32 place-content-center  ">
            <Loading />
          </div>
        </div>
      }
    >
      <main tw="bg-primary bg-noise">
        <div tw="relative  left-0 w-full border-b-2 border-t-2 border-white ">
          <CanvasWind lightIntensity={0.3} />
          <div tw="absolute bottom-0 px-28 pb-2">
            <p tw="text-center text-5xl text-white">AEOLUS INTRODUCTION</p>
          </div>
        </div>
        <div tw="grid grid-cols-2 gap-16 px-28 pt-12 ">
          {/* Needs this div for sticky to work properly */}
          <div>
            <div tw="sticky top-44 self-start  bg-white bg-noise p-4">
              <TextHeader tw="my-6 text-secondary-dark">
                What is Aeolus Protocol?
              </TextHeader>
              <div tw="grid grid-cols-3 border-[1px] border-white">
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.7} />
                </div>
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind
                    lightIntensity={0.6}
                    tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70"
                  />
                </div>

                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind
                    lightIntensity={0.5}
                    tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70"
                  />
                </div>
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.5} />
                </div>
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.4} />
                </div>

                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.3} />
                </div>
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.3} />
                </div>
                <div tw="transition-duration[500ms] border-[1px] border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.2} />
                </div>

                <div tw="transition-duration[500ms] border-2 border-white hover:opacity-70">
                  <CanvasWind lightIntensity={0.15} />
                </div>
              </div>
            </div>
          </div>
          <div tw="" id="about">
            <TextDescription tw="mb-8">
              &emsp;&emsp; Aeolus Protocol is a passive cryptocurrency fund
              operating on Avalanche Blockchain that earns additional yield on
              top of capital gains by providing the underlying assets in the
              fund to the liquidity pool.
            </TextDescription>
            <p tw="my-2">∆ &nbsp;Extra Yield</p>
            <TextDescription>
              &emsp;&emsp;By using Aeolus Protocol investors will earn
              additional yield comparing to tradition cyptocurrency fund. This
              strategy is proven to be resilient to sideway and bear market
              condition.
            </TextDescription>
            <p tw="my-2">∆ &nbsp;One-step Process</p>
            <TextDescription>
              &emsp;&emsp;Aeolus Protocol simplifies the process of yield
              farming into a one-click process. Traditionally, if the investor
              wishes to use the same strategy as Aeolus Protocol to invest in 2
              pairs of LP, it would have taken 4 transactions to swap the token,
              2 transactions to add liquidity, and another 2 transactions to add
              LP in the pool. Aeolus Protocol combine the whole process into 1
              transaction.
            </TextDescription>
          </div>
          <AnimationOnScroll
            animateIn="animate__fadeIn"
            delay={500}
            animateOnce
          >
            {/* Needs this div for sticky to work properly */}
            <div id="why" tw="sticky top-20 self-start p-4">
              <TextDescription>
                &emsp;&emsp; The three main parts of this dAPP are smart
                contracts, frontend, and backend. The smart contracts are the
                execution part of this protocol. The frontend allows users to
                interact with the protocol through the web interface. The
                backend acts as the database for tracking users’ transactions.
              </TextDescription>
              <TextDescription>
                &emsp;&emsp;
                {`Smart contracts are separated into two main parts, the core
                  contracts including AeolusFactory and AeolusPair contracts,
                  which is the central logic of Aeolus Protocol, and the
                  periphery contract includes AeolusRouter contract, which is
                  the contract that communicates with users and other
                  decentralized exchange’s contracts.`}
              </TextDescription>
              <TextDescription>
                &emsp;&emsp;After users chose and invest in AeolusPair with
                USDT.e, AeolusRouter contract will then swap the supplied USDT.e
                into the designated token of the AeolusPair through DEX
                contract. Then, the those tokens will be paired, and provided in
                a liquidity pool on the DEX. Once the process is done, the
                AeolusPair LP token will be minted to the investor to represent
                the ownership of money in AeolusPair.
              </TextDescription>
            </div>
          </AnimationOnScroll>

          {/* Needs this div for sticky to work properly */}
          <AnimationOnScroll animateIn="animate__fadeIn">
            <div
              id="mechanics"
              tw="sticky top-44 flex flex-col justify-center gap-4 self-start  bg-white bg-noise p-4"
            >
              <TextHeader tw="my-4 text-secondary-dark">
                How does Aeolus Protocol work?
              </TextHeader>
              <div tw="grid place-content-center ">
                <Image
                  src="/aeolus-overview.png"
                  height="350px"
                  width="550px"
                  alt="crypto overview"
                />
              </div>
              <div tw="grid place-content-center ">
                <Image
                  src="/aeolus-contracts-overview.png"
                  height="450px"
                  width="550px"
                  alt="crypto overview"
                />
              </div>
            </div>
          </AnimationOnScroll>
          {/* Needs this div for sticky to work properly */}
          <AnimationOnScroll animateIn="animate__fadeIn">
            <div tw="bg-white bg-noise p-4" id="code">
              <TextHeader tw="mb-6 text-secondary-dark">
                {"Is the source code for Aeolus Protocol verified?"}
              </TextHeader>
              <Image
                src="/aeolus-code.png"
                height="500px"
                width="1400px"
                alt="aeolus code"
              />
            </div>
          </AnimationOnScroll>

          <AnimationOnScroll animateIn="animate__fadeIn" delay={500}>
            <div tw="sticky top-44 self-start p-4">
              <TextDescription tw="word-break[break-all]">
                &emsp;&emsp;All contracts of Aeolus Protocol were verified and
                deployed on the Avalanche C-Chain Mainnet, AeolusFactory was
                deployed at the address
                &nbsp;0xfAC701de57226B83325ABE2f0D8f053C8759dC46 on blocknumber
                14015130. The source code can be inspected in the link
                <a
                  tw="text-underline-offset[3px] text-accent-300 underline opacity-70 hover:opacity-100"
                  href="https://snowtrace.io/address/0xfac701de57226b83325abe2f0d8f053c8759dc46#code"
                >
                  &nbsp;https://snowtrace.io/address/0xfac701de57226b83325abe2f0d8f053c8759dc46#code.
                </a>
                &nbsp;AeolusRouter was deployed at the address
                0xB2412D9eCc65D5919B681Bca3f25Fb1B2fE5a391 on blocknumber
                14015145. The source code is available at
                <a
                  tw="text-underline-offset[3px] text-accent-300 underline opacity-70 hover:opacity-100"
                  href="https://snowtrace.io/address/0xb2412d9ecc65d5919b681bca3f25fb1b2fe5a391#code"
                >
                  &nbsp;https://snowtrace.io/address/0xb2412d9ecc65d5919b681bca3f25fb1b2fe5a391#code.
                </a>
              </TextDescription>
            </div>
          </AnimationOnScroll>
          <AnimationOnScroll animateIn="animate__fadeIn" delay={500}>
            <div tw="sticky top-44 self-start p-4">
              <TextDescription tw="word-break[break-word]">
                &emsp;&emsp;The decentralized exchange chosen in the initial
                phase for exchanging token and providing liquidity under the
                hood is Trader Joe, due to its being the highest trading volume
                DEX as well as the numerous offering of various liquidity pools.
                Users can interact directly with the AeolusRouter contract, and
                observe its state variable on the Snowtrace website through the
                read-write section at
                <a
                  tw="text-underline-offset[3px] text-accent-300 underline opacity-70 hover:opacity-100"
                  href="https://snowtrace.io/address/0xb2412d9ecc65d5919b681bca3f25fb1b2fe5a391#writeContract"
                >
                  &nbsp;https://snowtrace.io/address/0xb2412d9ecc65d5919b681bca3f25fb1b2fe5a391#writeContract
                </a>
                &nbsp;or they can choose to interact with the dAPP and its
                underlying smart contracts through this website.
              </TextDescription>
            </div>
          </AnimationOnScroll>
          <AnimationOnScroll animateIn="animate__fadeIn">
            <div id="dex" tw="sticky top-44 self-start bg-white bg-noise p-4">
              <TextHeader tw="mb-8 text-secondary-dark">
                {"What DEX does Aeolus Protocol interact with?"}
              </TextHeader>
              <Image
                src="/traderjoe.jpeg"
                height="350px"
                width="550px"
                alt="crypto overview"
              />
            </div>
          </AnimationOnScroll>
          <AnimationOnScroll animateIn="animate__fadeIn">
            <div
              id="disclaimer"
              tw="sticky top-44 self-start bg-white bg-noise p-4"
            >
              <TextHeader tw="text-secondary-dark">{"Disclaimer"}</TextHeader>
            </div>
          </AnimationOnScroll>
          <AnimationOnScroll animateIn="animate__fadeIn">
            <TextDescription>
              &emsp;&emsp;Aeolus Protocol is developed as a Proof-of-Concept and
              is in the beta stage. While the protocol is fully functional and
              has been tested, investors should NOT invest until the official
              version is released.
            </TextDescription>
          </AnimationOnScroll>
        </div>
        <div tw="grid place-items-center py-12">
          <Link href="/protocol">
            <a>
              <Button size="medium">Enter App</Button>
            </a>
          </Link>
        </div>
      </main>
    </Suspense>
  );
};

Main.getLayout = function getLayout(page: ReactElement) {
  return <Layout type="main">{page}</Layout>;
};

const TextHeader = tw.p`
text-2xl before:content-["◆ "] text-center text-primary  underline text-underline-offset[8px]
`;

const TextDescription = tw.p`
text-sm leading-7 
`;

export default Main;
