import { createInterfaceId } from "./createInterfaceId.js";
import hre from "hardhat";
import { labelhash, namehash } from "viem";

export const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const setRootNodeOwner = async ({ ensRegistry, root }) => {
  await ensRegistry.write.setOwner([ZERO_HASH, root.address]);
};
const setRootSubnodeOwner = async ({ root, label, owner: subnodeOwner }) => {
  const { owner } = await hre.getNamedAccounts();
  return await root.write.setSubnodeOwner([labelhash(label), subnodeOwner.address], {
    account: owner,
  });
};
const setAddrReverseNodeOwner = async ({ ensRegistry, reverseRegistrar }) => {
  const { owner } = await hre.getNamedAccounts();
  return await ensRegistry.write.setSubnodeOwner([namehash("reverse"), labelhash("addr"), reverseRegistrar.address], {
    account: owner,
  });
};
const setBaseRegistrarResolver = async ({ baseRegistrarImplementation, ethOwnedResolver }) => {
  const { owner } = await hre.getNamedAccounts();
  return await baseRegistrarImplementation.write.setResolver([ethOwnedResolver.address], {
    account: owner,
  });
};
const addBaseRegistrarController = async ({ baseRegistrarImplementation, controller }) => {
  const { owner } = await hre.getNamedAccounts();
  return await baseRegistrarImplementation.write.addController([controller.address], {
    account: owner,
  });
};
const setEthResolverInterface = async ({ ethOwnedResolver, interfaceName, contract }) => {
  const { owner } = await hre.getNamedAccounts();
  const contractInterface = await hre.artifacts.readArtifact(interfaceName);
  const interfaceId = createInterfaceId(contractInterface.abi);
  return await ethOwnedResolver.write.setInterface([namehash("eth"), interfaceId, contract.address], {
    account: owner,
  });
};
const setReverseDefaultResolver = async ({ reverseRegistrar, contract }) => {
  const { owner } = await hre.getNamedAccounts();
  return await reverseRegistrar.write.setDefaultResolver([contract.address], {
    account: owner,
  });
};
export async function deployEnsStack() {
  const ensRegistry = await hre.viem.deployContract("ENSRegistry", []);
  const root = await hre.viem.deployContract("Root", [ensRegistry.address]);
  const walletClients = await hre.viem.getWalletClients();
  await setRootNodeOwner({ ensRegistry, root });
  await root.write.setController([walletClients[1].account.address, true]);
  await root.write.transferOwnership([walletClients[1].account.address]);
  const reverseRegistrar = await hre.viem.deployContract("ReverseRegistrar", [ensRegistry.address]);
  await reverseRegistrar.write.transferOwnership([walletClients[1].account.address]);
  await setRootSubnodeOwner({
    root,
    label: "reverse",
    owner: walletClients[1].account,
  });
  await setAddrReverseNodeOwner({ ensRegistry, reverseRegistrar });
  const baseRegistrarImplementation = await hre.viem.deployContract("BaseRegistrarImplementation", [
    ensRegistry.address,
    namehash("eth"),
  ]);
  await baseRegistrarImplementation.write.transferOwnership([walletClients[1].account.address]);
  await setRootSubnodeOwner({
    root,
    label: "eth",
    owner: baseRegistrarImplementation,
  });
  const ethOwnedResolver = await hre.viem.deployContract("OwnedResolver", []);
  await ethOwnedResolver.write.transferOwnership([walletClients[1].account.address]);
  await setBaseRegistrarResolver({
    baseRegistrarImplementation,
    ethOwnedResolver,
  });
  const dummyOracle = await hre.viem.deployContract("DummyOracle", [160000000000n]);
  const exponentialPremiumPriceOracle = await hre.viem.deployContract("ExponentialPremiumPriceOracle", [
    dummyOracle.address,
    [0n, 0n, 20294266869609n, 5073566717402n, 158548959919n],
    100000000000000000000000000n,
    21n,
  ]);
  const staticMetadataService = await hre.viem.deployContract("StaticMetadataService", [
    "http://localhost:8080/name/0x{id}",
  ]);
  const nameWrapper = await hre.viem.deployContract("NameWrapper", [
    ensRegistry.address,
    baseRegistrarImplementation.address,
    staticMetadataService.address,
  ]);
  await nameWrapper.write.transferOwnership([walletClients[1].account.address]);
  await addBaseRegistrarController({
    baseRegistrarImplementation,
    controller: nameWrapper,
  });
  await setEthResolverInterface({
    ethOwnedResolver,
    interfaceName: "INameWrapper",
    contract: nameWrapper,
  });
  const ethRegistrarController = await hre.viem.deployContract("ETHRegistrarController", [
    baseRegistrarImplementation.address,
    exponentialPremiumPriceOracle.address,
    60n,
    86400n,
    reverseRegistrar.address,
    nameWrapper.address,
    ensRegistry.address,
  ]);
  await ethRegistrarController.write.transferOwnership([walletClients[1].account.address]);
  await nameWrapper.write.setController([ethRegistrarController.address, true], {
    account: walletClients[1].account,
  });
  await reverseRegistrar.write.setController([ethRegistrarController.address, true], {
    account: walletClients[1].account,
  });
  await setEthResolverInterface({
    ethOwnedResolver,
    interfaceName: "IETHRegistrarController",
    contract: ethRegistrarController,
  });
  const staticBulkRenewal = await hre.viem.deployContract("StaticBulkRenewal", [ethRegistrarController.address]);
  await setEthResolverInterface({
    ethOwnedResolver,
    interfaceName: "IBulkRenewal",
    contract: staticBulkRenewal,
  });
  const publicResolver = await hre.viem.deployContract("PublicResolver", [
    ensRegistry.address,
    nameWrapper.address,
    ethRegistrarController.address,
    reverseRegistrar.address,
  ]);
  await setReverseDefaultResolver({
    reverseRegistrar,
    contract: publicResolver,
  });
  const universalResolver = await hre.viem.deployContract("UniversalResolver", [
    ensRegistry.address,
    ["http://universal-offchain-resolver.local/"],
  ]);
  return {
    ensRegistry,
    root,
    reverseRegistrar,
    baseRegistrarImplementation,
    ethOwnedResolver,
    dummyOracle,
    exponentialPremiumPriceOracle,
    staticMetadataService,
    nameWrapper,
    ethRegistrarController,
    staticBulkRenewal,
    publicResolver,
    universalResolver,
  };
}
