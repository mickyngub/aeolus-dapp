import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

interface Props {
  children?: any;
  type: "main" | "protocol";
}

const Layout = ({ children, type }: Props) => {
  return (
    <>
      <Navbar type={type} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
