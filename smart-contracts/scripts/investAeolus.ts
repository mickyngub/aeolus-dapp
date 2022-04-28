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

import { getSigner, getExchangeWAVAXandUSDTdoteContracts } from "./utils";

let investor: SignerWithAddress;
let AeolusFactoryContract: AeolusFactory;
let AeolusRouterContract: AeolusRouter;
let AeolusPairContract: AeolusPair;
let ExchangeRouterContract: AVAXJoeRouter02Type;

let WAVAXContract: IWAVAX;
let USDTdoteContract: IERC20;

const swapAVAXToWAVAX = async (): Promise<void> => {
  await WAVAXContract.deposit({
    value: hre.ethers.utils.parseEther("10"),
  });
};

const swapWAVAXToUSDTdote = async (): Promise<void> => {
  await WAVAXContract.approve(
    ExchangeRouterContract.address,
    hre.ethers.constants.MaxUint256
  );

  await ExchangeRouterContract.swapTokensForExactTokens(
    hre.ethers.utils.parseUnits("10", 6),
    hre.ethers.utils.parseEther("100"),
    [AVAXApprovedTokens.WAVAX.address, AVAXStableTokens["USDT.e"].address],
    investor.address,
    hre.ethers.constants.MaxUint256
  );
};

const investPair = async () => {
  await USDTdoteContract.approve(
    AeolusRouterContract.address,
    hre.ethers.constants.MaxUint256
  );
  await AeolusRouterContract.investPair(
    1,
    hre.ethers.utils.parseUnits("100", 6)
  );
};

const redeemPair = async () => {
  await AeolusRouterContract.redeemPair(1);
};

(async () => {
  investor = await getSigner();
  [ExchangeRouterContract, WAVAXContract, USDTdoteContract] =
    await getExchangeWAVAXandUSDTdoteContracts();
  // Need AeolusRouter address
  // await swapAVAXToWAVAX();
  // await swapWAVAXToUSDTdote();
  // await investPair();
})();
