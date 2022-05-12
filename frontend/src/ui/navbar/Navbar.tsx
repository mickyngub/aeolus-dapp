import React from "react";
import "twin.macro";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import Button from "~/src/ui/button/Button";
import { ToastContainer, toast } from "react-toastify";

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
  { name: "Crypto Market", url: "#cryptoMarket" },
  { name: "Pair", url: "#pair" },
];

interface Props {
  type?: "main" | "protocol";
}

const Navbar = ({ type }: Props) => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();
  const connectWalletMoralis = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Signin to Aeolus Protocol" })
        .then((user) => {
          console.log("logged in user", user);
          // const address = user!.get("ethAddress");
          // setAddress(address);
          notifyWalletConnected();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const moralisLogout = async () => {
    await logout();
    notifyWalletDisconnected();
    console.log("logged out");
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
            <p tw="text-xl font-bold">AEOLUS</p>
          </a>
        </Link>

        {navLists !== ""
          ? navLists.map((navList) => {
              return (
                <a href={navList.url} key={navList.name}>
                  <div>{navList.name}</div>
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
              {account && (
                <p tw="text-white">
                  {account.substring(0, 8)}......
                  {account.substring(account.length - 8)}
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

export default Navbar;
