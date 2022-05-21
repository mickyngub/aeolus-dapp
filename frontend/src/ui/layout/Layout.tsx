import "twin.macro";

import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

interface Props {
  children?: any;
  type?: "main" | "protocol";
}

const Layout = ({ children, type }: Props) => {
  return (
    <>
      <Navbar type={type} />
      <div tw="bg-primary bg-noise">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
