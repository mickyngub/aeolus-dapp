import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

interface Props {
  children?: any;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
