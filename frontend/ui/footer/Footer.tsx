import React from "react";
import "twin.macro";
import Link from "next/link";

const footerLists = [
  {
    name: "About",
    url: "#about",
  },

  {
    name: "Team",
    url: "#team",
  },
];

const Footer = () => {
  return (
    <footer tw="bg-primary-dark">
      <div tw="flex justify-around">
        <Link href="/">
          <a>
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>
        {footerLists.map((footerList) => {
          return <div>{footerList.name}</div>;
        })}
      </div>
    </footer>
  );
};

export default Footer;
