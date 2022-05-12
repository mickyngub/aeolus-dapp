import React from "react";
import "twin.macro";
import Link from "next/link";
import CanvasWind from "../canvasWind/CanvasWind";

const Footer = () => {
  return (
    <footer tw="border-t-2 border-white bg-primary bg-noise">
      <div tw="relative top-0 left-0 w-full">
        <CanvasWind lightIntensity={0.1} />
        <div tw="absolute bottom-0 top-0 left-0 right-0 m-auto h-5 w-20">
          <Link href="/">
            <a>
              <p tw="text-xl font-bold text-white">AEOLUS</p>
            </a>
          </Link>
          {/* {footerLists.map((footerList) => {
          return <div key={footerList.name}>{footerList.name}</div>;
        })} */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
