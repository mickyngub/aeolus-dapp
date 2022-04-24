import { task } from "hardhat/config";
import { AeolusFactory__factory, AeolusRouter__factory } from "../typechain";
import AVAXJoeRouter02 from "../deployments/AVAXJoeRouter02.json";
import AVAXApprovedTokens from "../deployments/AVAXApprovedTokens.json";
import AVAXStableTokens from "../deployments/AVAXStableTokens.json";

task("deploy", "deploy contracts")
  .addFlag("verify")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    console.log("signer is", signer.address);

    const aeolusFactory = await new AeolusFactory__factory(signer).deploy();
    console.log(`AeolusFactory deployed at ${aeolusFactory.address}`);

    const aeolusRouter = await new AeolusRouter__factory(signer).deploy(
      aeolusFactory.address,
      AVAXJoeRouter02.address,
      AVAXApprovedTokens.WAVAX.address,
      AVAXStableTokens["USDT.e"].address
    );
    console.log(`AeolusRouter deployed at ${aeolusRouter.address}`);

    if (taskArgs.verify) {
      await hre.run("verify:verify", {
        address: aeolusFactory.address,
        constructorArguments: [],
      });
      console.log("Verify completed");
    }

    const joeRouter02 = new hre.ethers.Contract(
      AVAXJoeRouter02.address,
      AVAXJoeRouter02.abi,
      signer
    );

    console.log("JOEJOEJOE", await joeRouter02.factory());
  });
