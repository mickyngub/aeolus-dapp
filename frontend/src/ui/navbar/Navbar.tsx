import { useState, useEffect } from "react";
import "twin.macro";
import styled from "styled-components";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { ToastContainer, toast } from "react-toastify";

import Button from "~/src/ui/button/Button";

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
    name: "Code",
    url: "#code",
  },
  {
    name: "DEX",
    url: "#dex",
  },
  { name: "Disclaimer", url: "#disclaimer" },
];

const navListsProtocol = [
  {
    name: "Dashboard",
    url: "#dashboard",
  },
  { name: "Crypto Market", url: "#cryptoMarket" },
  { name: "Aeolus Pair", url: "#pair" },
];

interface Props {
  type?: "main" | "protocol";
}

const Navbar = ({ type }: Props) => {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const [dbAddress, setDBAddress] = useState(user?.get("ethAddress"));

  useEffect(() => {
    setDBAddress(user?.get("ethAddress"));
  }, [user]);

  const connectWalletMoralis = async () => {
    if (!isAuthenticated) {
      await authenticate({
        signingMessage: "Signin to Aeolus Protocol",
        onSuccess: () => notifyWalletConnected(),
      })
        .then((user) => {
          console.log("logged in user", user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const moralisLogout = async () => {
    await logout();
    notifyWalletDisconnected();
  };
  const notifyWalletConnected = () => {
    toast("Wallet Connected");
  };
  const notifyWalletDisconnected = () => {
    toast.error("Wallet Disconnected");
  };
  const navLists =
    type === "main"
      ? navListsMain
      : type === "protocol"
      ? navListsProtocol
      : "";
  return (
    <nav tw="h-14 bg-primary-dark bg-noise px-28">
      <div tw="flex h-full items-center justify-start gap-16">
        <Link href="/">
          <a>
            <p tw="transition-duration[600ms] text-xl font-bold hover:text-white">
              AEOLUS
            </p>
          </a>
        </Link>

        {navLists !== ""
          ? navLists.map((navList) => {
              return (
                <a href={navList.url} key={navList.name}>
                  <StyledAnchor>{navList.name}</StyledAnchor>
                </a>
              );
            })
          : null}
        <div tw="ml-auto">
          {!isAuthenticated ? (
            <Button size="extraSmall" onClick={connectWalletMoralis}>
              Connect Wallet
            </Button>
          ) : (
            <div tw="flex items-center gap-4">
              {dbAddress && (
                <p tw="text-white">
                  {dbAddress.substring(0, 8)}......
                  {dbAddress.substring(dbAddress.length - 8)}
                </p>
              )}
              <Button size="extraSmall" onClick={moralisLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </nav>
  );
};

const StyledAnchor = styled.p`
  display: inline-block;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    &::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

export default Navbar;
