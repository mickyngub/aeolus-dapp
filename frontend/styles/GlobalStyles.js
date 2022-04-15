import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import { colors } from "~/styles/colors";

const CustomStyles = createGlobalStyle`
    /*
    1. Use a more-intuitive box-sizing model.
  */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  /*
    2. Remove default margin
  */
  * {
    margin: 0;
  }
  /*
    3. Allow percentage-based heights in the application
  */
  html, body, #__next{
    height: 100%;
    font-family: "Playfair Display", serif;
    --color-primary: ${colors.primary};
    --color-primary-dark: ${colors["primary-dark"]};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-black: ${colors.black};
    --color-white: ${colors.white};
  }
  /*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
  */
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  /*
    6. Improve media defaults
  */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  /*
    7. Remove built-in form typography styles
  */
  input, button, textarea, select {
    font: inherit;
  }
  /*
    8. Avoid text overflows
  */
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  /*
    9. Create a root stacking context
  */
  #root, #__next {
    isolation: isolate;
  }

`;

const GlobalStyles = () => {
  return (
    <>
      <BaseStyles />
      <CustomStyles />
    </>
  );
};

export default GlobalStyles;
