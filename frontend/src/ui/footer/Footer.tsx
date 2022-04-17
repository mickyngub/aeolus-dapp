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
    <footer tw="bg-primary-dark bg-noise h-20">
      <div tw="h-full flex justify-around items-center">
        <Link href="/">
          <a>
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>
        {footerLists.map((footerList) => {
          return <div key={footerList.name}>{footerList.name}</div>;
        })}
      </div>
    </footer>
  );
};

export default Footer;
