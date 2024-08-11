// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable
import { IERC721$Type } from "./IERC721";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "hardhat/types/artifacts";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["IERC721"]: IERC721$Type;
    ["@openzeppelin/contracts/token/ERC721/IERC721.sol:IERC721"]: IERC721$Type;
  }

  interface ContractTypesMap {
    ["IERC721"]: GetContractReturnType<IERC721$Type["abi"]>;
    ["@openzeppelin/contracts/token/ERC721/IERC721.sol:IERC721"]: GetContractReturnType<IERC721$Type["abi"]>;
  }
}
