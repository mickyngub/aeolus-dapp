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
  console.log(
    `AeolusFactory contract deployed at ${AeolusFactoryContract.address}`
  );
  AeolusRouterContract = await new AeolusRouter__factory(deployer).deploy(
    AeolusFactoryContract.address,
    AVAXJoeRouter02.address,
    AVAXStableTokens["USDT.e"].address,
    AVAXApprovedTokens.WAVAX.address,
    AVAXJoeFactory.address
  );
  console.log(
    `AeolusRouter contract deployed at ${AeolusRouterContract.address}`
  );
};
const approvedTokens = async () => {
  await AeolusFactoryContract.addApprovedToken(
    "WBTC.e",
    AVAXApprovedTokens["WBTC.e"].address
  );
  console.log(`approved WBTC.e`);
  await AeolusFactoryContract.addApprovedToken(
    "WETH.e",
    AVAXApprovedTokens["WETH.e"].address
  );
  console.log(`approved WETH.e`);
  await AeolusFactoryContract.addApprovedToken(
    "WAVAX",
    AVAXApprovedTokens.WAVAX.address
  );
  console.log(`approved WAVAX`);
  await AeolusFactoryContract.addApprovedToken(
    "SOL",
    AVAXApprovedTokens.SOL.address
  );
  console.log(`approved SOL`);
  await AeolusFactoryContract.addApprovedToken(
    "LUNA",
    AVAXApprovedTokens.LUNA.address
  );
  console.log(`approved LUNA`);
};
const approvedStableTokens = async () => {
  await AeolusFactoryContract.addStableToken(
    "USDT.e",
    AVAXStableTokens["USDT.e"].address
  );
  console.log(`approved USDT.e`);
  await AeolusFactoryContract.addStableToken(
    "USDC.e",
    AVAXStableTokens["USDC.e"].address
  );
  console.log(`approved USDC.e`);
  await AeolusFactoryContract.addStableToken(
    "MIM",
    AVAXStableTokens.MIM.address
  );
  console.log(`approved MIM`);
};
const linkOrUpdateApprovedTokenToStableToken = async () => {
  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "WBTC.e",
    "USDC.e"
  );
  console.log(`linked WBTC.e-USDC.e`);

  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "WETH.e",
    "USDC.e"
  );
  console.log(`linked WETH.e-USDC.e`);

  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "SOL",
    "USDC.e"
  );
  console.log(`linked SOL-USDC.e`);

  await AeolusFactoryContract.linkOrUpdateApprovedTokenToStableToken(
    "LUNA",
    "USDC.e"
  );
  console.log(`linked SOL-USDC.e`);
};
const createAeolusPair = async () => {
  const AeolusPair1 = await AeolusFactoryContract.createPair(
    "WBTC.e",
    "WETH.e",
    AeolusRouterContract.address
  );
  console.log("AeolusPair WBTC.e-WETH.e created at ", AeolusPair1);
  const AeolusPair2 = await AeolusFactoryContract.createPair(
    "SOL",
    "LUNA",
    AeolusRouterContract.address
  );
  console.log("AeolusPair SOL-LUNA created at ", AeolusPair2);
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
