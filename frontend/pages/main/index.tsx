import "twin.macro";
import type { ReactElement } from "react";
import { Suspense } from "react";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import Link from "next/link";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";
import Loading from "~/src/ui/loading/Loading";
const Main = () => {
  return (
    <Suspense
      fallback={
        <div tw="min-h-full bg-primary bg-noise">
          <div tw="absolute top-0 bottom-0 right-0 left-0 m-auto grid h-32 w-32 place-content-center  ">
            <Loading />
          </div>
        </div>
      }
    >
      <main tw="bg-primary bg-noise">
        <div tw="relative top-0 left-0 w-full">
          <CanvasWind lightIntensity={0.3} />
          <div tw="absolute bottom-0 px-8 pb-2">
            <p tw="text-center text-5xl text-white">AEOLUS PROTOCOL</p>
          </div>
        </div>
        <div tw="grid grid-cols-2 gap-16 p-8">
          <div id="about" tw="">
            <p tw="text-xl">{"What's Aeolus Protocol?"}</p>
          </div>
          <div tw="">
            <p tw="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
              labore, accusantium tenetur dolor officiis pariatur accusamus
              consequatur consequuntur dicta, culpa et velit. Atque delectus
              dolor laudantium sequi quae beatae. Aliquam, corporis error
              asperiores repellendus explicabo sint dolore tempora pariatur iure
              eius hic ab provident obcaecati id, ipsum, nesciunt maxime enim.
              Voluptates, possimus!
            </p>
          </div>
          <div tw="">
            <p tw="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
              labore, accusantium tenetur dolor officiis pariatur accusamus
              consequatur consequuntur dicta, culpa et velit. Atque delectus
              dolor laudantium sequi quae beatae. Aliquam, corporis error
              asperiores repellendus explicabo sint dolore tempora pariatur iure
              eius hic ab provident obcaecati id, ipsum, nesciunt maxime enim.
              Voluptates, possimus!
            </p>
          </div>
          <div id="mechanics" tw="">
            <p tw="text-xl">How does Aeolus Protocol work?</p>
          </div>
          <div id="team" tw="">
            <p tw="text-xl">{"Who's the team behind Aeolus Protocol?"}</p>
          </div>
          <div tw="">
            <p tw="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
              labore, accusantium tenetur dolor officiis pariatur accusamus
              consequatur consequuntur dicta, culpa et velit. Atque delectus
              dolor laudantium sequi quae beatae. Aliquam, corporis error
              asperiores repellendus explicabo sint dolore tempora pariatur iure
              eius hic ab provident obcaecati id, ipsum, nesciunt maxime enim.
              Voluptates, possimus!
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
