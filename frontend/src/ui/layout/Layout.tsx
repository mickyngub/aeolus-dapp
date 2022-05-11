import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import "twin.macro";

interface Props {
  children?: any;
  type?: "main" | "protocol";
}

const Layout = ({ children, type }: Props) => {
  return (
    <>
      <Navbar type={type} />
      <div tw="bg-primary bg-noise px-28">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
