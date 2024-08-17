// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/resolver/ISchemaResolver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract AttestationService is Ownable {
  IEAS private immutable eas;
  ISchemaRegistry private immutable schemaRegistry;

  bytes32 public missionEnrollmentSchema;

  event SchemaCreated(bytes32 indexed schemaId);
  event AttestationCreated(bytes32 indexed attestationId, address indexed recipient);

  constructor(address _eas, address _schemaRegistry, address initialOwner) Ownable(initialOwner) {
    eas = IEAS(_eas);
    schemaRegistry = ISchemaRegistry(_schemaRegistry);
  }

  function createMissionEnrollmentSchema() external onlyOwner {
    string memory schema = "address userAddress,uint256 tokenId,uint256 timestamp";
    bytes32 schemaId = schemaRegistry.register(schema, ISchemaResolver(address(0)), true);
    missionEnrollmentSchema = schemaId;
    emit SchemaCreated(schemaId);
  }

  function createMissionEnrollmentAttestation(address recipient, uint256 tokenId) external returns (bytes32) {
    require(missionEnrollmentSchema != bytes32(0), "Schema not created");

    bytes memory data = abi.encode(recipient, tokenId, block.timestamp);

    AttestationRequest memory request = AttestationRequest({
      schema: missionEnrolmentSchema,
      data: AttestationRequestData({
        recipient: recipient,
        expirationTime: 0, // No expiration
        revocable: true,
        refUID: bytes32(0), // No reference UID
        data: data,
        value: 0 // No value transfer
      })
    });

    bytes32 attestationId = eas.attest(request);
    emit AttestationCreated(attestationId, recipient);
    return attestationId;
  }

  function verifyAttestation(bytes32 attestationId) external view returns (bool) {
    Attestation memory attestation = eas.getAttestation(attestationId);
    return attestation.uid == attestationId;
  }
}
