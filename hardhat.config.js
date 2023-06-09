const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy-ethers");
require("@nomiclabs/hardhat-web3");
require("hardhat-contract-sizer"); //yarn run hardhat size-contracts
require("solidity-coverage"); // $ npx hardhat coverage
require("hardhat-log-remover");
require("hardhat-abi-exporter");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-chai-matchers");

require("./hardhat/tasks");

require("dotenv").config();
require("cryptoenv").parse();

const mnemonic = { mnemonic: "test test test test test test test test test test test junk" };
const testnetPKs = [
    process.env.TESTNET_DEPLOYER_PRIVATE_KEY ?? "",
    process.env.TESTNET_SIGNER_PRIVATE_KEY ?? "",
    process.env.TESTNET_SIGNER_PRIVATE_KEY_2 ?? "",
].filter((item, i, arr) => item !== "" && arr.indexOf(item) === i);
const testnetAccounts = testnetPKs.length > 0 ? testnetPKs : mnemonic;

const mainnetPKs = [
    process.env.MAINNET_DEPLOYER_PRIVATE_KEY ?? "",
    process.env.PROPOSAL_CREATOR_PRIVATE_KEY ?? "",
].filter((item, i, arr) => item !== "" && arr.indexOf(item) === i);
const mainnetAccounts = mainnetPKs.length > 0 ? mainnetPKs : mnemonic;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
      version: "0.5.17",
      settings: {
          optimizer: {
              enabled: true,
              runs: 200,
          },
          outputSelection: {
              "*": {
                  "*": ["storageLayout"],
              },
          },
      },
  },
  abiExporter: {
      clear: true,
      runOnCompile: true,
      flat: true,
      spacing: 4,
  },
  contractSizer: {
      alphaSort: false,
      runOnCompile: false,
      disambiguatePaths: false,
  },
  namedAccounts: {
      deployer: {
          default: 0,
      },
      signer: {
          default: 1,
          rskSovrynMainnet: 0,
      },
  },
  networks: {
      hardhat: {
          chainId: 31337,
          allowUnlimitedContractSize: true,
          accounts: { mnemonic: "test test test test test test test test test test test junk" },
          initialBaseFeePerGas: 0,
          //blockGasLimit: 6800000,
          //gasPrice: 66000010,
      },
      localhost: {
          timeout: 100000,
      },
      rskForkedTestnet: {
          chainId: 31337,
          url: "http://127.0.0.1:8545/",
          gasPrice: 66000010,
          blockGasLimit: 6800000,
          accounts: testnetAccounts,
          live: true,
          tags: ["testnet", "forked"],
          timeout: 100000,
      },
      rskForkedTestnetFlashback: {
          chainId: 31337,
          accounts: testnetAccounts,
          url: "http://127.0.0.1:8545/",
          gasPrice: 66000010,
          blockGasLimit: 6800000,
          live: true,
          tags: ["testnet", "forked"],
          timeout: 100000,
      },
      rskForkedMainnetFlashback: {
          chainId: 31337,
          accounts: mainnetAccounts,
          url: "http://127.0.0.1:8545",
          blockGasLimit: 6800000,
          live: true,
          tags: ["mainnet", "forked"],
          timeout: 100000,
      },
      rskForkedMainnet: {
          chainId: 31337,
          accounts: mainnetAccounts,
          url: "http://127.0.0.1:8545",
          blockGasLimit: 6800000,
          live: true,
          tags: ["mainnet", "forked"],
          timeout: 100000,
      },
      /*localhost: {
          url: "http://127.0.0.1:8545/",
          allowUnlimitedContractSize: true,
          initialBaseFeePerGas: 0,
      },*/
      rskTestnet: {
          url: "https://public-node.testnet.rsk.co/",
          accounts: testnetAccounts,
          chainId: 31,
          confirmations: 4,
          gasMultiplier: 1.25,
          tags: ["testnet"],
          //timeout: 20000, // increase if needed; 20000 is the default value
          //allowUnlimitedContractSize, //EIP170 contrtact size restriction temporal testnet workaround
      },
      rskMainnet: {
          url: "https://public-node.rsk.co/",
          chainId: 30,
          accounts: mainnetAccounts,
          tags: ["mainnet"],
          //timeout: 20000, // increase if needed; 20000 is the default value
          timeout: 100000,
      },
      rskSovrynTestnet: {
          chainId: 31,
          url: "https://testnet.sovryn.app/rpc",
          accounts: testnetAccounts,
          gasPrice: 66000010,
          blockGasLimit: 6800000,
          confirmations: 4,
          gasMultiplier: 1.25,
          tags: ["testnet"],
          //timeout: 20000, // increase if needed; 20000 is the default value
          //allowUnlimitedContractSize, //EIP170 contrtact size restriction temporal testnet workaround
      },
      rskSovrynMainnet: {
          chainId: 30,
          url: "https://mainnet-dev.sovryn.app/rpc",
          accounts: mainnetAccounts,
          gasPrice: 66000010,
          blockGasLimit: 6800000,
          tags: ["mainnet"],
          timeout: 100000,
          //timeout: 20000, // increase if needed; 20000 is the default value
      },
  },
  paths: {
      sources: "./contracts",
      tests: "./tests",
      deploy: "./deployment/deploy",
      deployments: "./deployment/deployments",
  },
  external: {
      contracts: [
          {
              artifacts: "external/artifacts",
              // deploy: "node_modules/@cartesi/arbitration/export/deploy",
          },
          //{
          //artifacts: "node_modules/someotherpackage/artifacts",
          //},
      ],
      deployments: {
          rskSovrynTestnet: ["external/deployments/rskSovrynTestnet"],
          rskTestnet: [
              "external/deployments/rskSovrynTestnet",
              "deployment/deployments/rskSovrynTestnet",
          ],
          rskForkedTestnet: [
              "external/deployments/rskSovrynTestnet",
              "external/deployments/rskForkedTestnet",
          ],
          rskForkedTestnetFlashback: ["external/deployments/rskForkedTestnetFlashback"],
          rskForkedMainnetFlashback: ["external/deployments/rskForkedMainnetFlashback"],
          rskSovrynMainnet: ["external/deployments/rskSovrynMainnet"],
          rskMainnet: [
              "external/deployments/rskSovrynMainnet",
              "deployment/deployments/rskSovrynMainnet",
          ],
          rskForkedMainnet: [
              "external/deployments/rskSovrynMainnet",
              "deployment/deployments/rskSovrynMainnet",
              "external/deployments/rskForkedMainnet",
          ],
      },
  },
  typechain: {
      outDir: "types",
      target: "ethers-v5",
      alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
      externalArtifacts: ["external/artifacts/*.sol/!(*.dbg.json)"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
      // externalArtifacts: ["external/artifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  mocha: {
      timeout: 800000,
  },
};
