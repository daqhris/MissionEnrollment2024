import { DAY, FUSES } from "../../fixtures/constants.js";
import { dnsEncodeName } from "../../fixtures/dnsEncodeName.js";
import { toLabelId, toNameId } from "../../fixtures/utils.js";
import { deployNameWrapperFixture as baseFixture } from "./deploy.js";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers.js";
import { expect } from "chai";
import { getAbiItem, labelhash, namehash, padHex, zeroAddress } from "viem";

export const zeroAccount = { address: zeroAddress };
export const {
  CANNOT_UNWRAP,
  CANNOT_BURN_FUSES,
  CANNOT_TRANSFER,
  CANNOT_SET_RESOLVER,
  CANNOT_SET_TTL,
  CANNOT_CREATE_SUBDOMAIN,
  PARENT_CANNOT_CONTROL,
  CAN_DO_EVERYTHING,
  IS_DOT_ETH,
  CAN_EXTEND_EXPIRY,
  CANNOT_APPROVE,
} = FUSES;
export const MAX_EXPIRY = 2n ** 64n - 1n;
export const GRACE_PERIOD = 90n * DAY;
export const DUMMY_ADDRESS = padHex("0x01", { size: 20 });
export async function deployNameWrapperWithUtils() {
  const initial = await loadFixture(baseFixture);
  const { publicClient, ensRegistry, baseRegistrar, nameWrapper, accounts } = initial;
  const setSubnodeOwner = {
    onEnsRegistry: async ({ parentName, label, owner, account = 0 }) =>
      ensRegistry.write.setSubnodeOwner([namehash(parentName), labelhash(label), owner], {
        account: accounts[account],
      }),
    onNameWrapper: async ({ parentName, label, owner, fuses, expiry, account = 0 }) =>
      nameWrapper.write.setSubnodeOwner([namehash(parentName), label, owner, fuses, expiry], {
        account: accounts[account],
      }),
  };
  const setSubnodeRecord = {
    onEnsRegistry: async ({ parentName, label, owner, resolver, ttl, account = 0 }) =>
      ensRegistry.write.setSubnodeRecord([namehash(parentName), labelhash(label), owner, resolver, ttl], {
        account: accounts[account],
      }),
    onNameWrapper: async ({ parentName, label, owner, resolver, ttl, fuses, expiry, account = 0 }) =>
      nameWrapper.write.setSubnodeRecord([namehash(parentName), label, owner, resolver, ttl, fuses, expiry], {
        account: accounts[account],
      }),
  };
  const register = async ({ label, owner, duration, account = 0 }) =>
    baseRegistrar.write.register([toLabelId(label), owner, duration], {
      account: accounts[account],
    });
  const wrapName = async ({ name, owner, resolver, account = 0 }) =>
    nameWrapper.write.wrap([dnsEncodeName(name), owner, resolver], {
      account: accounts[account],
    });
  const wrapEth2ld = async ({ label, owner, fuses, resolver, account = 0 }) =>
    nameWrapper.write.wrapETH2LD([label, owner, fuses, resolver], {
      account: accounts[account],
    });
  const unwrapName = async ({ parentName, label, controller, account = 0 }) =>
    nameWrapper.write.unwrap([namehash(parentName), labelhash(label), controller], { account: accounts[account] });
  const unwrapEth2ld = async ({ label, registrant, controller, account = 0 }) =>
    nameWrapper.write.unwrapETH2LD([labelhash(label), registrant, controller], {
      account: accounts[account],
    });
  const setRegistryApprovalForWrapper = async ({ account = 0 } = {}) =>
    ensRegistry.write.setApprovalForAll([nameWrapper.address, true], {
      account: accounts[account],
    });
  const setBaseRegistrarApprovalForWrapper = async ({ account = 0 } = {}) =>
    baseRegistrar.write.setApprovalForAll([nameWrapper.address, true], {
      account: accounts[account],
    });
  const registerSetupAndWrapName = async ({
    label,
    fuses,
    resolver = zeroAddress,
    duration = 1n * DAY,
    account = 0,
  }) => {
    const owner = accounts[account];
    await register({ label, owner: owner.address, duration, account });
    await setBaseRegistrarApprovalForWrapper({ account });
    await wrapEth2ld({
      label,
      owner: owner.address,
      fuses,
      resolver,
      account,
    });
  };
  const getBlockTimestamp = async () => publicClient.getBlock().then(b => b.timestamp);
  const actions = {
    setSubnodeOwner,
    setSubnodeRecord,
    register,
    wrapName,
    wrapEth2ld,
    unwrapName,
    unwrapEth2ld,
    setRegistryApprovalForWrapper,
    setBaseRegistrarApprovalForWrapper,
    registerSetupAndWrapName,
    getBlockTimestamp,
  };
  return {
    ...initial,
    actions,
  };
}
export const runForContract = ({ contract, onNameWrapper, onBaseRegistrar, onEnsRegistry }) => {
  if (getAbiItem({ abi: contract.abi, name: "isWrapped" })) {
    if (!onNameWrapper) throw new Error("onNameWrapper not provided");
    return onNameWrapper(contract);
  }
  if (getAbiItem({ abi: contract.abi, name: "ownerOf" })) {
    if (!onBaseRegistrar) throw new Error("onBaseRegistrar not provided");
    return onBaseRegistrar(contract);
  }
  if (!onEnsRegistry) throw new Error("onEnsRegistry not provided");
  return onEnsRegistry(contract);
};
export const expectOwnerOf = name => ({
  on: contract => ({
    toBe: owner =>
      runForContract({
        contract,
        onNameWrapper: async nameWrapper =>
          expect(nameWrapper.read.ownerOf([toNameId(name)])).resolves.toEqualAddress(owner.address),
        onBaseRegistrar: async baseRegistrar => {
          if (name.includes(".")) throw new Error("Not a label");
          return expect(baseRegistrar.read.ownerOf([toLabelId(name)])).resolves.toEqualAddress(owner.address);
        },
        onEnsRegistry: async ensRegistry =>
          expect(ensRegistry.read.owner([namehash(name)])).resolves.toEqualAddress(owner.address),
      }),
  }),
});
