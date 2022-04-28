import hre from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AeolusFactory,
  AeolusFactory__factory,
  AeolusRouter,
  AeolusRouter__factory,
  AeolusPair,
  AVAXJoeRouter02 as AVAXJoeRouter02Type,
  IERC20,
  IWAVAX,
} from "../typechain";

import AVAXJoeRouter02 from "../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../deployments/AVAXStableTokens.json";
import AVAXJoeFactory from "../deployments/AVAXJoeFactory.json";

import { getSigner } from "./utils";

let deployer: SignerWithAddress;

let AeolusFactoryContract: AeolusFactory;
let AeolusRouterContract: AeolusRouter;

const deploy = async () => {
  AeolusFactoryContract = await new AeolusFactory__factory(deployer).deploy();

  AeolusRouterContract = await new AeolusRouter__factory(deployer).deploy(
    AeolusFactoryContract.address,
    AVAXJoeRouter02.address,
    AVAXStableTokens["USDT.e"].address,
    AVAXApprovedTokens.WAVAX.address,
    AVAXJoeFactory.address
  );
};
const approvedTokens = async () => {
  await AeolusFactoryContract.addApprovedToken(
    "WBTC.e",
    AVAXApprovedTokens["WBTC.e"].address
  );
  await AeolusFactoryContract.addApprovedToken(
    "WETH.e",
    AVAXApprovedTokens["WETH.e"].address
  );
  await AeolusFactoryContract.addApprovedToken(
    "WAVAX",
    AVAXApprovedTokens.WAVAX.address
  );
};
const approvedStableTokens = async () => {
  await AeolusFactoryContract.addStableToken(
    "USDT.e",
    AVAXStableTokens["USDT.e"].address
  );
  await AeolusFactoryContract.addStableToken(
    "USDC.e",
    AVAXStableTokens["USDC.e"].address
  );
};
const linkOrUpdateApprovedTokenToStableToken = async () => {
  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "WBTC.e",
    "USDC.e"
  );

  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "WETH.e",
    "USDC.e"
  );
};
const createAeolusPair = async () => {
  const AeolusPair = await AeolusFactoryContract.createPair(
    "WBTC.e",
    "WETH.e",
    AeolusRouterContract.address
  );
  console.log("AeolusPair created at ", AeolusPair);
};

// .then chain
// deploy().then(() =>
//   approvedTokens().then(() =>
//     approvedStableTokens().then(() =>
//       linkOrUpdateApprovedTokenToStableToken().then(() => createAeolusPair())
//     )
//   )
// );

(async () => {
  deployer = await getSigner();
  await deploy();
  await approvedTokens();
  await approvedStableTokens();
  await linkOrUpdateApprovedTokenToStableToken();
  await createAeolusPair();
})();
