import { pairDataArray } from "~/src/protocol/PairCards/PairCard/PairData";

export const findPairInPairDataArray = (pairID: string) => {
  return pairDataArray.filter((pair) => pair.pairID === pairID)[0];
};
