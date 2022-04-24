import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AeolusFactory,
  AeolusFactory__factory,
  AeolusRouter,
  AeolusRouter__factory,
  AVAXJoeRouter02 as AVAXJoeRouter02Type,
  IERC20,
  IWAVAX,
} from "../../typechain";

import AVAXJoeRouter02 from "../../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../../deployments/AVAXStableTokens.json";

import { expect } from "chai";
import { network, ethers } from "hardhat";

context("unit/AeolusRouter", () => {
  let deployer: SignerWithAddress;
  let micky: SignerWithAddress;
  let signers: SignerWithAddress[];

  let AeolusFactory: AeolusFactory;
  let AeolusRouter: AeolusRouter;
  let ExchangeRouter: AVAXJoeRouter02Type;

  let WAVAX: IWAVAX;
  let USDTdote: IERC20;

  let WAVAXAsMicky: IWAVAX;
  let USDTdoteAsMicky: IERC20;

  let AeolusFactoryAsMicky: AeolusFactory;
  let AeolusRouterAsMicky: AeolusRouter;
  let ExchangeRouterAsMicky: AVAXJoeRouter02Type;

  before(async () => {
    [deployer, micky, ...signers] = await ethers.getSigners();
    AeolusFactory = await new AeolusFactory__factory(deployer).deploy();
    AeolusFactoryAsMicky = AeolusFactory.connect(micky);

    AeolusRouter = await new AeolusRouter__factory(deployer).deploy(
      AeolusFactory.address,
      AVAXJoeRouter02.address,
      AVAXApprovedTokens.WAVAX.address,
      AVAXStableTokens["USDT.e"].address
    );

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

  describe("config AeolusRouter", () => {
    it("can swap AVAX to WAVAX", async () => {
      // await ExchangeRouter.swapAVAXForExactTokens;
      expect(await ethers.provider.getBalance(micky.address)).to.equal(
        ethers.utils.parseEther("10000")
      );
      await WAVAXAsMicky.deposit({
        value: ethers.utils.parseEther("1000"),
      });
      expect(await ethers.provider.getBalance(micky.address))
        .to.be.below(ethers.utils.parseEther("10000"))
        .and.above(ethers.utils.parseEther("8999"));
      expect(await WAVAX.balanceOf(micky.address)).to.equal(
        ethers.utils.parseEther("1000")
      );
    });
    it("can swap WAVAX to USDT.e", async () => {
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

      console.log(
        "USDT.e balance",
        ethers.utils.formatUnits(await USDTdote.balanceOf(micky.address), 6)
      );
    });
  });
});
