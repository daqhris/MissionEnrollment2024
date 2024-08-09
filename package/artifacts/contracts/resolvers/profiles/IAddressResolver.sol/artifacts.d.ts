// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { IAddressResolver$Type } from "./IAddressResolver";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["IAddressResolver"]: IAddressResolver$Type;
    ["contracts/resolvers/profiles/IAddressResolver.sol:IAddressResolver"]: IAddressResolver$Type;
  }

  interface ContractTypesMap {
    ["IAddressResolver"]: GetContractReturnType<IAddressResolver$Type["abi"]>;
    ["contracts/resolvers/profiles/IAddressResolver.sol:IAddressResolver"]: GetContractReturnType<IAddressResolver$Type["abi"]>;
  }
}
