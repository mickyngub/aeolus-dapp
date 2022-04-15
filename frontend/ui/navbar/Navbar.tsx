import React from "react";
import "twin.macro";
import Link from "next/link";

const navLists = [
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

const Navbar = () => {
  return (
    <nav tw="bg-primary-dark h-14">
      <div tw="h-full flex justify-around items-center">
        <Link href="/">
          <a>
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>
        {navLists.map((navList) => {
          return <div>{navList.name}</div>;
        })}
      </div>
    </nav>
  );
};

export default Navbar;
