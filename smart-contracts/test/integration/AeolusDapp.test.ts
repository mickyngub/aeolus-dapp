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
} from "../../typechain";

import AVAXJoeRouter02 from "../../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../../deployments/AVAXStableTokens.json";

import { expect } from "chai";
import { ethers } from "hardhat";

context("integration/AeolusDapp", () => {
  let deployer: SignerWithAddress;
  let micky: SignerWithAddress;
  let signers: SignerWithAddress[];
  let AeolusFactory: AeolusFactory;
  let AeolusRouter: AeolusRouter;
  let AeolusPair: AeolusPair;
  let ExchangeRouter: AVAXJoeRouter02Type;

  let AeolusFactoryAsMicky: AeolusFactory;
  let AeolusRouterAsMicky: AeolusRouter;
  let ExchangeRouterAsMicky: AVAXJoeRouter02Type;

  let WAVAX: IWAVAX;
  let USDTdote: IERC20;
  let WBTCdote: IERC20;
  let WETHdote: IERC20;

  let WAVAXAsMicky: IWAVAX;
  let USDTdoteAsMicky: IERC20;
  let WBTCdoteAsMicky: IERC20;
  let WETHdoteAsMicky: IERC20;

  before(async () => {
    [deployer, micky, ...signers] = await ethers.getSigners();
    AeolusFactory = await new AeolusFactory__factory(deployer).deploy();
    AeolusFactoryAsMicky = AeolusFactory.connect(micky);

    AeolusRouter = await new AeolusRouter__factory(deployer).deploy(
      AeolusFactory.address,
      AVAXJoeRouter02.address,
      AVAXStableTokens["USDT.e"].address,
      AVAXApprovedTokens.WAVAX.address
    );
    AeolusRouterAsMicky = AeolusRouter.connect(micky);

    ExchangeRouter = await ethers.getContractAt(
      "IExchangeRouter",
      AVAXJoeRouter02.address
    );
    ExchangeRouterAsMicky = ExchangeRouter.connect(micky);

    WAVAX = await ethers.getContractAt(
      "IWAVAX",
      AVAXApprovedTokens.WAVAX.address
    );
    WAVAXAsMicky = WAVAX.connect(micky);

    USDTdote = await ethers.getContractAt(
      "IERC20",
      AVAXStableTokens["USDT.e"].address
    );
    USDTdoteAsMicky = USDTdote.connect(micky);
  });

  before(async () => {
    // Add approved tokens
    await AeolusFactory.addApprovedToken(
      "WBTC.e",
      AVAXApprovedTokens["WBTC.e"].address
    );
    await AeolusFactory.addApprovedToken(
      "WETH.e",
      AVAXApprovedTokens["WETH.e"].address
    );
    await AeolusFactory.addApprovedToken(
      "WAVAX",
      AVAXApprovedTokens.WAVAX.address
    );

    // Add stable tokens
    await AeolusFactory.addStableToken(
      "USDT.e",
      AVAXStableTokens["USDT.e"].address
    );
    await AeolusFactory.addStableToken(
      "USDC.e",
      AVAXStableTokens["USDC.e"].address
    );

    // Link approved token to stable token
    await AeolusFactory.linkOrUpdateApprovedTokenToStableToken(
      "WBTC.e",
      "USDC.e"
    );

    await AeolusFactory.linkOrUpdateApprovedTokenToStableToken(
      "WETH.e",
      "USDC.e"
    );

    // Create pair
    await AeolusFactory.createPair("WBTC.e", "WETH.e", AeolusRouter.address);
  });

  before(async () => {
    await WAVAXAsMicky.deposit({
      value: ethers.utils.parseEther("1000"),
    });

    await WAVAXAsMicky.approve(
      ExchangeRouter.address,
      ethers.constants.MaxUint256
    );

    await ExchangeRouterAsMicky.swapExactTokensForTokens(
      ethers.utils.parseEther("100"),
      0,
      [AVAXApprovedTokens.WAVAX.address, AVAXStableTokens["USDT.e"].address],
      micky.address,
      ethers.constants.MaxUint256
    );

    const USDTdoteAmount = ethers.utils.formatUnits(
      await USDTdote.balanceOf(micky.address),
      6
    );
    console.log("USDT.e amount", USDTdoteAmount);

    await USDTdoteAsMicky.approve(
      AeolusRouter.address,
      ethers.constants.MaxUint256
    );
  });

  describe("pair investing", () => {
    it("can investPair WBTC.e - WETH.e", async () => {
      await AeolusRouterAsMicky.investPair(
        1,
        ethers.utils.parseUnits("1000", 6)
      );
    });
    it("can redeem invested WBTC.e - WETH.e", async () => {
      await AeolusRouterAsMicky.redeemPair(1);
    });
  });
});
