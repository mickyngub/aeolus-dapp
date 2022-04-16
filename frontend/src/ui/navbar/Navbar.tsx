import React from "react";
import "twin.macro";
import Link from "next/link";

const navListsMain = [
  {
    name: "About",
    url: "#about",
  },
  {
    name: "Mechanics",
    url: "#mechanics",
  },
  {
    name: "Team",
    url: "#team",
  },
];

const navListsProtocol = [
  {
    name: "Dashboard",
    url: "#dashboard",
  },
  { name: "Crypto Price", url: "#cryptoPrice" },
  { name: "Pool", url: "#pool" },
];

interface Props {
  type: "main" | "protocol";
}

const Navbar = ({ type }: Props) => {
  const navLists =
    type === "main"
      ? navListsMain
      : type === "protocol"
      ? navListsProtocol
      : "";
  return (
    <nav tw="bg-primary-dark bg-noise h-14">
      <div tw="h-full flex justify-around items-center">
        <Link href="/">
          <a>
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>

        {navLists !== ""
          ? navLists.map((navList) => {
              return <div>{navList.name}</div>;
            })
          : null}
      </div>
    </nav>
  );
};

export default Navbar;
