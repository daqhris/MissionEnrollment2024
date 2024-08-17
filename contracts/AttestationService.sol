// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/resolver/ISchemaResolver.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract AttestationService is AccessControl {
  IEAS private immutable eas;
  ISchemaRegistry private immutable schemaRegistry;

  bytes32 public missionEnrollmentSchema;
  bytes32 public constant ATTESTATION_CREATOR_ROLE = keccak256("ATTESTATION_CREATOR_ROLE");
  address public constant DAQHRIS_ETH_ADDRESS = 0x1234567890123456789012345678901234567890; // Replace with actual address of daqhris.eth

  event SchemaCreated(bytes32 indexed schemaId);
  event AttestationCreated(bytes32 indexed attestationId, address indexed recipient, address indexed attester);

  constructor(address _eas, address _schemaRegistry) {
    eas = IEAS(_eas);
    schemaRegistry = ISchemaRegistry(_schemaRegistry);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ATTESTATION_CREATOR_ROLE, DAQHRIS_ETH_ADDRESS);
  }

  function createMissionEnrollmentSchema() external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(missionEnrollmentSchema == bytes32(0), "Schema already created");
    string memory schema = "address userAddress,uint256 tokenId,uint256 timestamp,address attester";
    bytes32 schemaId = schemaRegistry.register(schema, ISchemaResolver(address(0)), true);
    missionEnrollmentSchema = schemaId;
    emit SchemaCreated(schemaId);
  }

  function createMissionEnrollmentAttestation(address recipient, uint256 tokenId) external onlyRole(ATTESTATION_CREATOR_ROLE) returns (bytes32) {
    require(missionEnrollmentSchema != bytes32(0), "Schema not created");
    require(recipient != address(0), "Invalid recipient address");
    require(tokenId > 0, "Invalid token ID");
    require(msg.sender == DAQHRIS_ETH_ADDRESS, "Only daqhris.eth can create attestations");

    bytes memory data = abi.encode(recipient, tokenId, block.timestamp, msg.sender);

    AttestationRequest memory request = AttestationRequest({
      schema: missionEnrollmentSchema,
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
    emit AttestationCreated(attestationId, recipient, msg.sender);
    return attestationId;
  }

  function verifyAttestation(bytes32 attestationId) external view returns (bool) {
    require(attestationId != bytes32(0), "Invalid attestation ID");
    Attestation memory attestation = eas.getAttestation(attestationId);
    return attestation.uid == attestationId && attestation.attester == DAQHRIS_ETH_ADDRESS;
  }

  function grantAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(account == DAQHRIS_ETH_ADDRESS, "Only daqhris.eth can be granted this role");
    grantRole(ATTESTATION_CREATOR_ROLE, account);
  }

  function revokeAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    revokeRole(ATTESTATION_CREATOR_ROLE, account);
  }
}
