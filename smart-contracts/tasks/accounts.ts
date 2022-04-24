import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log("api key", hre.config.etherscan.apiKey);
  for (const account of accounts) {
    console.log(account.address);
  }
});
