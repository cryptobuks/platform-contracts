/* eslint-disable global-require */
require("babel-register");
require("babel-polyfill");
const Ganache = require("ganache-core");

// dev network override
const now = Math.floor(new Date().getTime() / 1000);
const devNetworkDeploymentConfigOverride = {
  // give 5 minutes for deployment - Commitment deployment will fail if less than 24h from beginning
  START_DATE: now + 1 * 24 * 60 * 60 + 5 * 60,
  // setup mocked artifacts
  artifacts: {
    ICBM_COMMITMENT: "MockICBMCommitment",
    STANDARD_ETO_COMMITMENT: "MockETOCommitment",
  },
  // other addresses set to DEPLOYER
  addresses: {
    EURT_DEPOSIT_MANAGER: "0x9058B511C7450303F5Bc187aAf4cC25d7f7F88C6",
    IDENTITY_MANAGER: "0xF08E9c0FcC6A3972c5Fd80fF7D478E0Db3091768",
    GAS_EXCHANGE: "0x81cE04F4015077E53f01c2881865D78496861369",
    TOKEN_RATE_ORACLE: "0xB3E69d2637076D265bFb056bF5F35d9155535CD6",
  },
};
// forked mainnet override
const forkedLiveNetworkDeploymentConfigOverride = {
  ICBM_COMMITMENT_ADDRESS: "0xf432cec23b2a0d6062b969467f65669de81f4653",
  ISOLATED_UNIVERSE: true,
  // other addresses preserve ICBM or set to DEPLOYER
  addresses: {
    EURT_DEPOSIT_MANAGER: "0x86f1B38f1293CC2A520695CF35c03589DbD00B50",
    IDENTITY_MANAGER: "0x7791bD8f15c69AE01a72ef0a40A8967270712f9d",
    GAS_EXCHANGE: "0xdA9AcF6Fa7912C54e9aF86E2957DD4782129cFA8",
    TOKEN_RATE_ORACLE: "0x46CDC1c9C00bf1F5Dd71cBCC72d4ef08F841E334",
  },
};

const nanoProvider = (providerUrl, nanoPath, network) =>
  process.argv.some(arg => arg === network)
    ? require("./nanoWeb3Provider").nanoWeb3Provider(providerUrl, nanoPath)
    : undefined;

module.exports = {
  networks: {
    localhost: {
      network_id: "*",
      host: "localhost",
      port: 8545,
      gas: 6700000,
      gasPrice: 21000000000,
      from: "0x8a194c13308326173423119f8dcb785ce14c732b",
      deploymentConfigOverride: devNetworkDeploymentConfigOverride,
    },
    inprocess: {
      network_id: "*",
      provider: Ganache.provider({
        gasLimit: 6700000,
        accounts: Array(10).fill({ balance: "12300000000000000000000000" }),
      }),
    },
    nf_private: {
      host: "parity-instant-seal-byzantium-enabled",
      port: 8545,
      network_id: "17",
      gas: 6700000,
      gasPrice: 21000000000,
      from: "0x8a194c13308326173423119f8dcb785ce14c732b",
      deploymentConfigOverride: devNetworkDeploymentConfigOverride,
    },
    coverage: {
      network_id: "*",
      gas: 0xfffffffffff,
      gasPrice: 1,
      host: "localhost",
      port: 8555,
    },
    forked_live: {
      network_id: 72,
      host: "ethexp-node.neustg.net",
      port: 8545,
      gas: 6500000, // close to current mainnet limit
      gasPrice: 5000000000,
      from: "0x8a194c13308326173423119f8dcb785ce14c732b",
      deploymentConfigOverride: forkedLiveNetworkDeploymentConfigOverride,
    },
    localhost_live: {
      network_id: "*",
      host: "localhost",
      port: 8545,
      gas: 6500000,
      gasPrice: 21000000000,
      from: "0x8a194c13308326173423119f8dcb785ce14c732b",
      deploymentConfigOverride: {
        ICBM_COMMITMENT_ADDRESS: "0x5b8ce2b715522998053fe2cead3e70f9a2b6ea17",
        ISOLATED_UNIVERSE: true,
      },
    },
    live: {
      network_id: 1, // Ethereum public network
      host: "localhost",
      port: 8543,
      gas: 6500000, // close to current mainnet limit
      gasPrice: 5000000000, // 21 gwei /shannon
      from: "0x8a194c13308326173423119f8dcb785ce14c732b",
      deploymentConfigOverride: {
        ICBM_COMMITMENT_ADDRESS: "0xf432cec23b2a0d6062b969467f65669de81f4653",
        ISOLATED_UNIVERSE: true,
      },
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    },
    nano: {
      network_id: "*",
      gas: 4600000,
      provider: nanoProvider("http://localhost:8543", "44'/60'/105'/1", "nano"),
      gasPrice: 10000000000, // 10 gwei /shannon
    },
    nano_customer: {
      network_id: "*",
      gas: 4600000,
      provider: nanoProvider("http://localhost:8543", "44'/60'/0'/0", "nano_customer"),
      gasPrice: 10000000000, // 10 gwei /shannon
    },
    inprocess_test: {
      network_id: "*",
      provider: Ganache.provider({
        gasLimit: 6700000,
        accounts: Array(10).fill({ balance: "12300000000000000000000000" }),
      }),
      gas: 6700000,
    },
    localhost_test: {
      network_id: "*",
      host: "localhost",
      port: 8545,
      gas: 6700000,
    },
    inprocess_massive_test: {
      network_id: "*",
      gas: 0xffffffff,
      provider: Ganache.provider({
        deterministic: true,
        gasLimit: 0xffffffff,
        accounts: Array(100).fill({ balance: "12300000000000000000000000" }),
      }),
    },
  },
};
