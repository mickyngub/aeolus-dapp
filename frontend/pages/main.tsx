import "twin.macro";
import type { ReactElement } from "react";
import Button from "~/src/ui/button/Button";
import Layout from "~/src/ui/layout/Layout";
import Link from "next/link";
import CanvasWind from "~/src/ui/canvasWind/CanvasWind";

const Main = () => {
  return (
    <main tw="bg-primary bg-noise">
      <div tw="relative">
        <CanvasWind lightIntensity={0.3} />
        <div tw="absolute bottom-0 px-8 pb-2">
          <p tw="text-7xl text-center text-white">AEOLUS PROTOCOL</p>
        </div>
      </div>
      <div tw="grid grid-cols-2 gap-8 p-8">
        <div tw="">
          <p tw="text-2xl">{"What's Aeolus Protocol?"}</p>
        </div>
        <div tw="">
          <p tw="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
            labore, accusantium tenetur dolor officiis pariatur accusamus
            consequatur consequuntur dicta, culpa et velit. Atque delectus dolor
            laudantium sequi quae beatae. Aliquam, corporis error asperiores
            repellendus explicabo sint dolore tempora pariatur iure eius hic ab
            provident obcaecati id, ipsum, nesciunt maxime enim. Voluptates,
            possimus!
          </p>
        </div>

        <div tw="">
          <p tw="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
            labore, accusantium tenetur dolor officiis pariatur accusamus
            consequatur consequuntur dicta, culpa et velit. Atque delectus dolor
            laudantium sequi quae beatae. Aliquam, corporis error asperiores
            repellendus explicabo sint dolore tempora pariatur iure eius hic ab
            provident obcaecati id, ipsum, nesciunt maxime enim. Voluptates,
            possimus!
          </p>
        </div>
        <div tw="">
          <p tw="text-2xl">How does Aeolus Protocol work?</p>
        </div>
        <div tw="">
          <p tw="text-2xl">How to use Aeolus Protocol?</p>
        </div>
        <div tw="">
          <p tw="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            sapiente eligendi nisi iste quisquam adipisci nemo voluptate,
            labore, accusantium tenetur dolor officiis pariatur accusamus
            consequatur consequuntur dicta, culpa et velit. Atque delectus dolor
            laudantium sequi quae beatae. Aliquam, corporis error asperiores
            repellendus explicabo sint dolore tempora pariatur iure eius hic ab
            provident obcaecati id, ipsum, nesciunt maxime enim. Voluptates,
            possimus!
          </p>
        </div>
      </div>
      <div tw="grid place-items-center py-12">
        <Link href="/protocol">
          <a>
            <Button size="medium">Enter App</Button>
          </a>
        </Link>
      </div>
    </main>
  );
};

Main.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Main;
