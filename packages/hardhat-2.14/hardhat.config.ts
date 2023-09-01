import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as tenderly from "@tenderly/hardhat-tenderly";

tenderly.setup({ automaticVerifications: false });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "tenderly",
  networks: {
    tenderly: {
      url: "https://rpc.vnet.tenderly.co/devnet/mini-safe-tests/99d156dc-b4e8-4d16-8b29-d2ffb369bbd5",
    },
  },
  tenderly: {
    username: "nenad",
    project: "mini-safe",
    accessKey: process.env.TENDERLY_ACCESS_KEY,
  },
};

task("verifyExistingMS", "Verifies deployed MultiSigWallet instance")
  .addParam("address")
  .setAction(async (args, hre) => {
    await hre.run("compile");
    console.log("Verifying MS", args.address);

    // TODO: something wrong with verification:(

    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function sleep(fn: any, ...args: any) {
      await timeout(1000);
      return fn(...args);
    }

    console.log("Verifying regular");

    await hre.tenderly.verify({
      name: "MultiSigWallet",
      address: args.address,
    });

    await sleep(async () => {
      console.log("Verifying timed out");
      await hre.tenderly.verify({
        name: "MultiSigWallet",
        address: args.address,
      });
    });
  });
export default config;
