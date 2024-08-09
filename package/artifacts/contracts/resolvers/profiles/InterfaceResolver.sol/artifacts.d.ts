// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { InterfaceResolver$Type } from "./InterfaceResolver";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["InterfaceResolver"]: InterfaceResolver$Type;
    ["contracts/resolvers/profiles/InterfaceResolver.sol:InterfaceResolver"]: InterfaceResolver$Type;
  }

  interface ContractTypesMap {
    ["InterfaceResolver"]: GetContractReturnType<InterfaceResolver$Type["abi"]>;
    ["contracts/resolvers/profiles/InterfaceResolver.sol:InterfaceResolver"]: GetContractReturnType<InterfaceResolver$Type["abi"]>;
  }
}
