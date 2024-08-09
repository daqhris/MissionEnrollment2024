// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { ETHRegistrarController$Type } from "./ETHRegistrarController";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["ETHRegistrarController"]: ETHRegistrarController$Type;
    ["contracts/ethregistrar/ETHRegistrarController.sol:ETHRegistrarController"]: ETHRegistrarController$Type;
  }

  interface ContractTypesMap {
    ["ETHRegistrarController"]: GetContractReturnType<ETHRegistrarController$Type["abi"]>;
    ["contracts/ethregistrar/ETHRegistrarController.sol:ETHRegistrarController"]: GetContractReturnType<ETHRegistrarController$Type["abi"]>;
  }
}
