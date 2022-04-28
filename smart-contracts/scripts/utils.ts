import hre from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AVAXJoeRouter02 as AVAXJoeRouter02Type,
  IERC20,
  IWAVAX,
} from "../typechain";

import AVAXJoeRouter02 from "../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../deployments/AVAXStableTokens.json";

let deployer: SignerWithAddress;

let ExchangeRouterContract: AVAXJoeRouter02Type;

let WAVAXContract: IWAVAX;
let USDTdoteContract: IERC20;

export const getSigner = async (): Promise<SignerWithAddress> => {
  [deployer] = await hre.ethers.getSigners();
  return deployer;
};

export const getExchangeWAVAXandUSDTdoteContracts = async (): Promise<
  [AVAXJoeRouter02Type, IWAVAX, IERC20]
> => {
  ExchangeRouterContract = await hre.ethers.getContractAt(
    "IExchangeRouter",
    AVAXJoeRouter02.address
  );

  WAVAXContract = await hre.ethers.getContractAt(
    "IWAVAX",
    AVAXApprovedTokens.WAVAX.address
  );

  USDTdoteContract = await hre.ethers.getContractAt(
    "IERC20",
    AVAXStableTokens["USDT.e"].address
  );

  return [ExchangeRouterContract, WAVAXContract, USDTdoteContract];
};
