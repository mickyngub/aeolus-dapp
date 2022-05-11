import React from "react";
import "twin.macro";
import Link from "next/link";

const footerLists = [
  // {
  //   name: "About",
  //   url: "#about",
  // },
  // {
  //   name: "Team",
  //   url: "#team",
  // },
];

const Footer = () => {
  return (
    <footer tw="h-20 bg-primary-dark bg-noise">
      <div tw="flex h-full items-center justify-around">
        <Link href="/">
          <a>
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>
        {/* {footerLists.map((footerList) => {
          return <div key={footerList.name}>{footerList.name}</div>;
        })} */}
      </div>
    </footer>
  );
};

export default Footer;
