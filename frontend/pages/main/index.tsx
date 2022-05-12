import "twin.macro";
import type { ReactElement } from "react";
import { Suspense } from "react";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import Link from "next/link";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Loading from "~/src/ui/loading/Loading";
import Image from "next/image";

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
            <p tw="text-center text-5xl text-white">AEOLUS PROTOCOL</p>
          </div>
        </div>
        <div tw="grid grid-cols-2 gap-16 py-8 px-28 ">
          {/* Needs this div for sticky to work properly */}
          <div>
            <div
              id="about"
              tw="sticky top-44 self-start border-2 border-black bg-primary-dark bg-noise p-4"
            >
              <p tw="mb-4 text-2xl">{"What's Aeolus Protocol?"}</p>
            </div>
          </div>
          <div tw="">
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
          </div>
          <div tw="">
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
          </div>
          {/* Needs this div for sticky to work properly */}
          <div>
            <div
              id="mechanics"
              tw="sticky top-44 flex flex-col justify-center gap-4 self-start border-2 border-black bg-primary-dark bg-noise p-4"
            >
              <p tw="mb-4 text-2xl">How does Aeolus Protocol work?</p>
              <div tw="grid place-content-center border-2 border-black">
                <Image
                  src="/aeolus-overview.png"
                  height="350px"
                  width="550px"
                  alt="crypto overview"
                />
              </div>
              <div tw="grid place-content-center border-2 border-black">
                <Image
                  src="/aeolus-contracts-overview.png"
                  height="450px"
                  width="550px"
                  alt="crypto overview"
                />
              </div>
            </div>
          </div>
          {/* Needs this div for sticky to work properly */}
          <div>
            <div
              id="team"
              tw="sticky top-44 self-start border-2 border-black bg-primary-dark bg-noise p-4"
            >
              <p tw="text-2xl">{"Who's the team behind Aeolus Protocol?"}</p>
            </div>
          </div>
          <div tw="">
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
            <p tw="text-sm leading-7">
              &emsp;&emsp;Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quam sapiente eligendi nisi iste quisquam adipisci nemo
              voluptate, labore, accusantium tenetur dolor officiis pariatur
              accusamus consequatur consequuntur dicta, culpa et velit. Atque
              delectus dolor laudantium sequi quae beatae. Aliquam, corporis
              error asperiores repellendus explicabo sint dolore tempora
              pariatur iure eius hic ab provident obcaecati id, ipsum, nesciunt
              maxime enim. Voluptates, possimus!
            </p>
          </div>
        </div>
        <div tw="grid place-items-center py-12">
          <Link href="/protocol">
            <a>
              <Button size="small">Enter App</Button>
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

export default Main;
