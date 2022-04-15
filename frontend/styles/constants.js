const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/* Mobile First */

const QUERIES = {
  smAndBigger: `(max-width: ${BREAKPOINTS.sm / 16}rem)`,
  mdAndBigger: `(max-width: ${BREAKPOINTS.md / 16}rem)`,
  lgAndBigger: `(max-width: ${BREAKPOINTS.lg / 16}rem)`,
  xlAndBigger: `(max-width: ${BREAKPOINTS.xl / 16}rem)`,
  "2xlAndBigger": `(max-width: ${BREAKPOINTS["2xl"] / 16}rem)`,
};

export const THEME = {
  QUERIES,
};
