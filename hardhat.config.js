require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // },
    sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: ["03b5d010cf2b3497720807f99ae858448812e83e61099845b52217648380fcef"],
    }
  },
  paths: {
    artifacts: "./artifacts",
  },
};
