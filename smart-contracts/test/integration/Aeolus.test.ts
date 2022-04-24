import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  AeolusFactory,
  AeolusFactory__factory,
  AeolusRouter,
  AeolusRouter__factory,
  IExchangeRouter,
} from "../../typechain";

import AVAXJoeRouter02 from "../../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../../deployments/AVAXStableTokens.json";

import { expect } from "chai";
import { network, ethers } from "hardhat";

context("integration/AeolusDapp", () => {
  let deployer: SignerWithAddress;
  let micky: SignerWithAddress;
  let signers: SignerWithAddress[];

  let aeolusFactory: AeolusFactory;
  let aeolusRouter: AeolusRouter;
  let exchangeRouter;

  let aeolusFactoryAsMicky: AeolusFactory;
  let aeolusRouterAsMicky: AeolusRouter;

  before(async () => {
    [deployer, micky, ...signers] = await ethers.getSigners();
    aeolusFactory = await new AeolusFactory__factory(deployer).deploy();
    aeolusFactoryAsMicky = aeolusFactory.connect(micky);

    aeolusRouter = await new AeolusRouter__factory(deployer).deploy(
      aeolusFactory.address,
      AVAXJoeRouter02.address,
      AVAXApprovedTokens.WAVAX.address,
      AVAXStableTokens["USDT.e"].address
    );

    exchangeRouter = new ethers.Contract(
      AVAXJoeRouter02.address,
      AVAXJoeRouter02.abi,
      deployer
    );
  });

  describe("config AeolusFactory", async () => {
    it("can add approved tokens", async () => {
      await aeolusFactory.addApprovedToken(
        "WBTC.e",
        AVAXApprovedTokens["WBTC.e"].address
      );
      await aeolusFactory.addApprovedToken(
        "WETH.e",
        AVAXApprovedTokens["WETH.e"].address
      );
      expect(await aeolusFactory.getNumberOfApprovedTokens()).to.equal(2);
      //   expect(await aeolusFactory.approvedTokens.length);
    });
  });
});
