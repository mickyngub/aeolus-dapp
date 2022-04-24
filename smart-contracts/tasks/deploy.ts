import { task } from "hardhat/config";
import { AeolusFactory__factory } from "../typechain";
import AVAXJoeRouter02 from "../deployments/AVAXJoeRouter02.json";

task("deploy", "deploy contracts")
  .addFlag("verify")
  .setAction(async (taskArgs, hre) => {
    const [signer] = await hre.ethers.getSigners();
    console.log("signer is", signer.address);

    const aeolusFactory = await new AeolusFactory__factory(signer).deploy();
    console.log(`AeolusFactory deployed at ${aeolusFactory.address}`);

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
