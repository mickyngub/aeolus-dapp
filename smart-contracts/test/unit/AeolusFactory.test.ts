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
      await aeolusFactory.addApprovedToken(
        "WAVAX",
        AVAXApprovedTokens.WAVAX.address
      );
      expect(await aeolusFactory.getNumberOfApprovedTokens()).to.equal(3);
      expect((await aeolusFactory.approvedTokens(1)).tokenAddress).to.hexEqual(
        AVAXApprovedTokens["WBTC.e"].address
      );
      expect((await aeolusFactory.approvedTokens(1)).tokenSymbol).to.equal(
        "WBTC.e"
      );
    });

    it("can add stable tokens", async () => {
      await aeolusFactory.addStableToken(
        "USDT.e",
        AVAXStableTokens["USDT.e"].address
      );
      await aeolusFactory.addStableToken("USDt", AVAXStableTokens.USDt.address);
      expect(await aeolusFactory.getNumberOfStableTokens()).to.equal(2);
      expect((await aeolusFactory.stableTokens(1)).stableAddress).to.hexEqual(
        AVAXStableTokens["USDT.e"].address
      );
      expect((await aeolusFactory.stableTokens(1)).stableSymbol).to.equal(
        "USDT.e"
      );
    });

    it("can link approved token to stable token", async () => {
      // Needs to revert bc BNB is not approved yet
      await expect(
        aeolusFactory.linkOrUpdateApprovedTokenToStableToken("BNB", "USDT.e")
      ).to.be.revertedWith("Approved Token DNE");
      // Needs to revert bc MIM is not added yet
      await expect(
        aeolusFactory.linkOrUpdateApprovedTokenToStableToken("WBTC.e", "MIM")
      ).to.be.revertedWith("Stable Pair DNE");

      // Link approved token to stable token
      await aeolusFactory.linkOrUpdateApprovedTokenToStableToken(
        "WBTC.e",
        "USDT.e"
      );

      await aeolusFactory.linkOrUpdateApprovedTokenToStableToken(
        "WAVAX",
        "USDT.e"
      );

      expect(
        await aeolusFactory.addressApprovedTokenToAddressStableToken(
          AVAXApprovedTokens["WBTC.e"].address
        )
      ).to.hexEqual(AVAXStableTokens["USDT.e"].address);

      expect(
        await aeolusFactory.approvedTokenIDToStableTokenID(
          await aeolusFactory.symbolToApprovedTokenID("WBTC.e")
        )
      ).to.equal(await aeolusFactory.symbolToStableTokenID("USDT.e"));
    });

    it("can update approved token to stable token", async () => {
      // Update stable token of approved token
      await expect(
        aeolusFactory.linkOrUpdateApprovedTokenToStableToken("WBTC.e", "USDt")
      ).to.not.be.reverted;

      expect(
        await aeolusFactory.addressApprovedTokenToAddressStableToken(
          AVAXApprovedTokens["WBTC.e"].address
        )
      ).to.hexEqual(AVAXStableTokens["USDt"].address);

      expect(
        await aeolusFactory.approvedTokenIDToStableTokenID(
          await aeolusFactory.symbolToApprovedTokenID("WBTC.e")
        )
      ).to.equal(await aeolusFactory.symbolToStableTokenID("USDt"));
    });

    it("can create pair", async () => {
      // Needs to revert bc BNB is not approved yet
      await expect(
        aeolusFactory.createPair("BNB", "WBTC.e")
      ).to.be.revertedWith("Aeolus: TokenA is not approved");
      // Needs to revert bc LUNA is not approved yet
      await expect(
        aeolusFactory.createPair("WBTC.e", "LUNA")
      ).to.be.revertedWith("Aeolus: TokenB is not approved");
      // Needs to revert since they are same token
      await expect(
        aeolusFactory.createPair("WBTC.e", "WBTC.e")
      ).to.be.revertedWith("Aeolus: IDENTICAL_TOKEN_SYMBOL");
      // Needs to revert since it has no stable token pair
      await expect(
        aeolusFactory.createPair("WBTC.e", "WETH.e")
      ).to.be.revertedWith("Aeolus: TokenB has no stable pair");

      await aeolusFactory.createPair("WBTC.e", "WAVAX");

      expect(await aeolusFactory.getNumberOfPools()).to.equal(1);

      const pairDetail = await aeolusFactory.getPair(1);

      expect(pairDetail.name).to.equal("WBTC.e-WAVAX");
      expect(pairDetail.tokenA).to.hexEqual(
        AVAXApprovedTokens["WBTC.e"].address
      );
      expect(pairDetail.tokenB).to.hexEqual(AVAXApprovedTokens.WAVAX.address);

      expect(await aeolusFactory.nameToPairID("WBTC.e-WAVAX")).to.equal(1);
    });
  });
});
