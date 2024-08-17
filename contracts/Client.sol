// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";

// End consumer library.
library Client {
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct EVMTokenAmount {
    address token; // token address on the local chain.
    uint256 amount; // Amount of tokens.
  }

  // Cross-chain functionality removed

  // If extraArgs is empty bytes, the default is 200k gas limit.
  struct EVM2AnyMessage {
    bytes receiver; // abi.encode(receiver address) for dest EVM chains
    bytes data; // Data payload
    EVMTokenAmount[] tokenAmounts; // Token transfers
    address feeToken; // Address of feeToken. address(0) means you will send msg.value.
    bytes extraArgs; // Populate this with _argsToBytes(EVMExtraArgsV2)
  }

  // Removed EVM_EXTRA_ARGS_V1_TAG constant

  struct EVMExtraArgsV1 {
    uint256 gasLimit;
  }

  function _argsToBytes(EVMExtraArgsV1 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V1_TAG, extraArgs);
  }

  // Removed EVM_EXTRA_ARGS_V2_TAG constant

  /// @param gasLimit: gas limit for the callback on the destination chain.
  /// @param allowOutOfOrderExecution: if true, it indicates that the message can be executed in any order relative to other messages from the same sender.
  /// This value's default varies by chain. On some chains, a particular value is enforced, meaning if the expected value
  /// is not set, the message request will revert.
  struct EVMExtraArgsV2 {
    uint256 gasLimit;
    bool allowOutOfOrderExecution;
  }

  function _argsToBytes(EVMExtraArgsV2 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V2_TAG, extraArgs);
  }

  /// @notice Verifies if an address has a valid ENS name associated with it
  /// @param addr The address to verify
  /// @param ensRegistry The address of the ENS registry contract
  /// @return bool Returns true if the address has a valid ENS name, false otherwise
  function verifyOnchainIdentity(address addr, address ensRegistry) internal view returns (bool) {
    ENS ens = ENS(ensRegistry);
    bytes32 node = reverseNode(addr);
    address resolver = ens.resolver(node);
    if (resolver == address(0)) {
      return false;
    }
    Resolver resolverContract = Resolver(resolver);
    string memory name = resolverContract.name(node);
    return bytes(name).length > 0;
  }

  function reverseNode(address addr) internal pure returns (bytes32) {
    return
      keccak256(
        abi.encodePacked(
          bytes32(0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2),
          keccak256(abi.encodePacked(addr))
        )
      );
  }

  function namehash(bytes memory name) internal pure returns (bytes32) {
    bytes32 node = 0x0000000000000000000000000000000000000000000000000000000000000000;
    uint i = 0;
    while (i < name.length) {
      uint labelLen = uint8(name[i]);
      i++;
      if (i + labelLen > name.length) break;
      bytes32 labelHash = keccak256(abi.encodePacked(slice(name, i, labelLen)));
      node = keccak256(abi.encodePacked(node, labelHash));
      i += labelLen;
    }
    return node;
  }

  function slice(bytes memory data, uint start, uint len) internal pure returns (bytes memory) {
    bytes memory b = new bytes(len);
    for (uint i = 0; i < len; i++) {
      b[i] = data[i + start];
    }
    return b;
  }
}
