import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AeolusFactory,
  AeolusFactory__factory,
  AeolusRouter,
  AeolusRouter__factory,
  AVAXJoeRouter02 as AVAXJoeRouter02Type,
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

  let WAVAXAsMicky: IWAVAX;
  let AeolusFactoryAsMicky: AeolusFactory;
  let AeolusRouterAsMicky: AeolusRouter;

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

    WAVAX = await ethers.getContractAt(
      "IWAVAX",
      AVAXApprovedTokens.WAVAX.address
    );

    WAVAXAsMicky = WAVAX.connect(micky);
  });

  describe("config AeolusRouter", () => {
    it("can swap AVAX to WAVAX", async () => {
      // await ExchangeRouter.swapAVAXForExactTokens;
      expect(await ethers.provider.getBalance(micky.address)).to.equal(
        ethers.utils.parseEther("10000")
      );
      await WAVAXAsMicky.deposit({
        value: ethers.utils.parseEther("1"),
      });
      expect(await ethers.provider.getBalance(micky.address))
        .to.be.below(ethers.utils.parseEther("10000"))
        .and.above(ethers.utils.parseEther("9998"));
      expect(await WAVAX.balanceOf(micky.address)).to.equal(
        ethers.utils.parseEther("1")
      );
    });
  });
});
