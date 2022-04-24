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

context("unit/AeolusFactory", () => {
  let deployer: SignerWithAddress;
  let micky: SignerWithAddress;
  let signers: SignerWithAddress[];

  let AeolusFactory: AeolusFactory;
  let AeolusRouter: AeolusRouter;
  let ExchangeRouter;

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

    ExchangeRouter = new ethers.Contract(
      AVAXJoeRouter02.address,
      AVAXJoeRouter02.abi,
      deployer
    );
  });

  describe("config AeolusFactory", async () => {
    it("can add approved tokens", async () => {
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
      expect(await AeolusFactory.getNumberOfApprovedTokens()).to.equal(3);
      expect((await AeolusFactory.approvedTokens(1)).tokenAddress).to.hexEqual(
        AVAXApprovedTokens["WBTC.e"].address
      );
      expect((await AeolusFactory.approvedTokens(1)).tokenSymbol).to.equal(
        "WBTC.e"
      );
    });

    it("can add stable tokens", async () => {
      await AeolusFactory.addStableToken(
        "USDT.e",
        AVAXStableTokens["USDT.e"].address
      );
      await AeolusFactory.addStableToken("USDt", AVAXStableTokens.USDt.address);
      expect(await AeolusFactory.getNumberOfStableTokens()).to.equal(2);
      expect((await AeolusFactory.stableTokens(1)).stableAddress).to.hexEqual(
        AVAXStableTokens["USDT.e"].address
      );
      expect((await AeolusFactory.stableTokens(1)).stableSymbol).to.equal(
        "USDT.e"
      );
    });

    it("can link approved token to stable token", async () => {
      // Needs to revert bc BNB is not approved yet
      await expect(
        AeolusFactory.linkOrUpdateApprovedTokenToStableToken("BNB", "USDT.e")
      ).to.be.revertedWith("Approved Token DNE");
      // Needs to revert bc MIM is not added yet
      await expect(
        AeolusFactory.linkOrUpdateApprovedTokenToStableToken("WBTC.e", "MIM")
      ).to.be.revertedWith("Stable Pair DNE");

      // Link approved token to stable token
      await AeolusFactory.linkOrUpdateApprovedTokenToStableToken(
        "WBTC.e",
        "USDT.e"
      );

      await AeolusFactory.linkOrUpdateApprovedTokenToStableToken(
        "WAVAX",
        "USDT.e"
      );

      expect(
        await AeolusFactory.addressApprovedTokenToAddressStableToken(
          AVAXApprovedTokens["WBTC.e"].address
        )
      ).to.hexEqual(AVAXStableTokens["USDT.e"].address);

      expect(
        await AeolusFactory.approvedTokenIDToStableTokenID(
          await AeolusFactory.symbolToApprovedTokenID("WBTC.e")
        )
      ).to.equal(await AeolusFactory.symbolToStableTokenID("USDT.e"));
    });

    it("can update approved token to stable token", async () => {
      // Update stable token of approved token
      await expect(
        AeolusFactory.linkOrUpdateApprovedTokenToStableToken("WBTC.e", "USDt")
      ).to.not.be.reverted;

      expect(
        await AeolusFactory.addressApprovedTokenToAddressStableToken(
          AVAXApprovedTokens["WBTC.e"].address
        )
      ).to.hexEqual(AVAXStableTokens["USDt"].address);

      expect(
        await AeolusFactory.approvedTokenIDToStableTokenID(
          await AeolusFactory.symbolToApprovedTokenID("WBTC.e")
        )
      ).to.equal(await AeolusFactory.symbolToStableTokenID("USDt"));
    });

    it("can create pair", async () => {
      // Needs to revert bc BNB is not approved yet
      await expect(
        AeolusFactory.createPair("BNB", "WBTC.e")
      ).to.be.revertedWith("Aeolus: TokenA is not approved");
      // Needs to revert bc LUNA is not approved yet
      await expect(
        AeolusFactory.createPair("WBTC.e", "LUNA")
      ).to.be.revertedWith("Aeolus: TokenB is not approved");
      // Needs to revert since they are same token
      await expect(
        AeolusFactory.createPair("WBTC.e", "WBTC.e")
      ).to.be.revertedWith("Aeolus: IDENTICAL_TOKEN_SYMBOL");
      // Needs to revert since it has no stable token pair
      await expect(
        AeolusFactory.createPair("WBTC.e", "WETH.e")
      ).to.be.revertedWith("Aeolus: TokenB has no stable pair");

      await AeolusFactory.createPair("WBTC.e", "WAVAX");

      expect(await AeolusFactory.getNumberOfPools()).to.equal(1);

      const pairDetail = await AeolusFactory.getPair(1);

      expect(pairDetail.name).to.equal("WBTC.e-WAVAX");
      expect(pairDetail.tokenA).to.hexEqual(
        AVAXApprovedTokens["WBTC.e"].address
      );
      expect(pairDetail.tokenB).to.hexEqual(AVAXApprovedTokens.WAVAX.address);

      expect(await AeolusFactory.nameToPairID("WBTC.e-WAVAX")).to.equal(1);
    });
  });
});
