// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/resolver/ISchemaResolver.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract AttestationService is AccessControl {
  IEAS private immutable eas;
  ISchemaRegistry private immutable schemaRegistry;

  bytes32 public missionEnrollmentSchema;
  bytes32 public constant ATTESTATION_CREATOR_ROLE = keccak256("ATTESTATION_CREATOR_ROLE");
  string private constant MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS = "mission-enrollment.daqhris.eth";

  event SchemaCreated(bytes32 indexed schemaId);
  event AttestationCreated(bytes32 indexed attestationId, address indexed recipient, address indexed attester);

  constructor(address _eas, address _schemaRegistry) {
    require(_eas != address(0) && _schemaRegistry != address(0), "Invalid address");
    eas = IEAS(_eas);
    schemaRegistry = ISchemaRegistry(_schemaRegistry);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ATTESTATION_CREATOR_ROLE, address(this)); // Temporary grant to contract itself
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
    require(recipient != address(0), "Invalid recipient");
    require(tokenId != 0, "Invalid token ID");

    bytes memory data = abi.encode(recipient, tokenId, block.timestamp, msg.sender);

    AttestationRequest memory request = AttestationRequest({
      schema: missionEnrollmentSchema,
      data: AttestationRequestData({
        recipient: recipient,
        expirationTime: 0,
        revocable: true,
        refUID: bytes32(0),
        data: data,
        value: 0
      })
    });

    bytes32 attestationId = eas.attest(request);
    emit AttestationCreated(attestationId, recipient, msg.sender);
    return attestationId;
  }

  function verifyAttestation(bytes32 attestationId) external view returns (bool) {
    require(attestationId != bytes32(0), "Invalid attestation ID");
    Attestation memory attestation = eas.getAttestation(attestationId);
    return attestation.uid == attestationId && keccak256(abi.encodePacked(attestation.attester)) == keccak256(abi.encodePacked(MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS));
  }

  function grantAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(keccak256(abi.encodePacked(account)) == keccak256(abi.encodePacked(MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS)), "Only MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS can be granted this role");
    grantRole(ATTESTATION_CREATOR_ROLE, account);
  }

  function revokeAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(keccak256(abi.encodePacked(account)) != keccak256(abi.encodePacked(MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS)), "Cannot revoke role from main attestation creator");
    revokeRole(ATTESTATION_CREATOR_ROLE, account);
  }
}
