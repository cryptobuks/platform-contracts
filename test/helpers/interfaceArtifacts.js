import { knownInterfaces } from "./knownInterfaces";
import { artifacts } from "./artifacts";

// all interfaces must be present here
const keyToKey = Object.keys(knownInterfaces).reduce(
  (obj, x) => Object.assign(obj, { [x]: x }),
  {},
);

// maps known interfaces into artifacts (abis). if more than one artifact is provided, abi discovery is provided via ...
// todo: implement and describe concrete abi discovery
export const interfaceToArtifacts = {
  [keyToKey.accessPolicy]: [artifacts.ROLE_BASED_ACCESS_POLICY],
  [keyToKey.forkArbiter]: [artifacts.ETHEREUM_FORK_ARBITER],
  [keyToKey.identityRegistry]: [artifacts.IDENTITY_REGISTRY],
  [keyToKey.etherToken]: [artifacts.ETHER_TOKEN],
  [keyToKey.euroToken]: [artifacts.EURO_TOKEN],
  [keyToKey.etherLock]: [artifacts.LOCKED_ACCOUNT],
  [keyToKey.euroLock]: [artifacts.LOCKED_ACCOUNT],
  [keyToKey.neumark]: [artifacts.NEUMARK],
  [keyToKey.tokenExchangeRateOracle]: ["ITokenExchangeRateOracle"],
  [keyToKey.gasExchange]: [artifacts.GAS_EXCHANGE],
  [keyToKey.feeDisbursal]: ["IFeeDisbursal"],
  [keyToKey.platformPortfolio]: ["IPlatformPortfolio"],
  [keyToKey.tokenExchange]: [],
  [keyToKey.icbmEuroLock]: [artifacts.ICBM_LOCKED_ACCOUNT],
  [keyToKey.icbmEtherLock]: [artifacts.ICBM_LOCKED_ACCOUNT],
  [keyToKey.icbmEuroToken]: [artifacts.ICBM_EURO_TOKEN],
  [keyToKey.icbmEtherToken]: [artifacts.ICBM_ETHER_TOKEN],
  [keyToKey.icbmCommitment]: [artifacts.ICBM_COMMITMENT],
  [keyToKey.universe]: [artifacts.UNIVERSE],
  [keyToKey.platformTerms]: [artifacts.PLATFORM_TERMS],
  // more than one artifact (abi) planned soon
  [keyToKey.commitmentInterface]: [artifacts.STANDARD_ETO_COMMITMENT, ""],
  [keyToKey.equityTokenInterface]: [artifacts.STANDARD_EQUITY_TOKEN, ""],
  [keyToKey.equityTokenControllerInterface]: [artifacts.PLACEHOLDER_EQUITY_TOKEN_CONTROLLER, ""],
};

// verify all known interfaces are mapped
for (const i of Object.keys(knownInterfaces)) {
  if (!(i in interfaceToArtifacts)) {
    throw new Error(`${i} must be present in interfaceToArtifacts`);
  }
}
