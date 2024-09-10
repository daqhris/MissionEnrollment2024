// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";
import "./utils/AttestationUtils.sol";

contract AttestationService is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    IEAS private eas;
    ISchemaRegistry private schemaRegistry;
    AttestationUtils.EAS private easStruct;

    bytes32 private _missionEnrollmentSchema;
    bytes32 public constant ATTESTATION_CREATOR_ROLE = keccak256("ATTESTATION_CREATOR_ROLE");
    address private constant MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS = 0xF0bC5CC2B4866dAAeCb069430c60b24520077037;

    mapping(address => bool) private approvedAttestationCreators;

    event SchemaCreated(bytes32 indexed schemaId);
    event AttestationCreated(bytes32 indexed attestationId, address indexed recipient, address indexed attester);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _eas, address _schemaRegistry) public initializer {
        require(_eas != address(0) && _schemaRegistry != address(0), "Invalid address");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        eas = IEAS(_eas);
        schemaRegistry = ISchemaRegistry(_schemaRegistry);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        approvedAttestationCreators[MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS] = true;
    }

    function createMissionEnrollmentSchema() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_missionEnrollmentSchema == bytes32(0), "Schema already created");
        AttestationUtils.EAS memory easInstance = AttestationUtils.EAS(eas, schemaRegistry);
        _missionEnrollmentSchema = AttestationUtils.createMissionEnrollmentSchema(easInstance);
        emit SchemaCreated(_missionEnrollmentSchema);
    }

    function createMissionEnrollmentAttestation(address recipient, uint256 tokenId) external returns (bytes32) {
        require(approvedAttestationCreators[msg.sender], "Not authorized to create attestations");
        require(_missionEnrollmentSchema != bytes32(0), "Schema not created");
        require(recipient != address(0), "Invalid recipient");
        require(tokenId != 0, "Invalid token ID");

        AttestationUtils.EAS memory easInstance = AttestationUtils.EAS({
            eas: eas,
            schemaRegistry: schemaRegistry
        });

        bytes memory data = abi.encode(recipient, tokenId, block.timestamp, msg.sender);
        bytes32 attestationId = AttestationUtils.submitAttestation(
            easInstance,
            _missionEnrollmentSchema,
            recipient,
            tokenId,
            data
        );

        emit AttestationCreated(attestationId, recipient, msg.sender);
        return attestationId;
    }

    function verifyAttestation(bytes32 attestationId) external view returns (bool) {
        require(attestationId != bytes32(0), "Invalid attestation ID");
        Attestation memory attestation = eas.getAttestation(attestationId);
        return attestation.uid == attestationId && approvedAttestationCreators[attestation.attester];
    }

    function grantAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        approvedAttestationCreators[account] = true;
    }

    function revokeAttestationCreatorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != MISSION_ENROLLMENT_DAQHRIS_ETH_ADDRESS, "Cannot revoke role from main attestation creator");
        approvedAttestationCreators[account] = false;
    }

    function isApprovedAttestationCreator(address account) external view returns (bool) {
        return approvedAttestationCreators[account];
    }

    function getMissionEnrollmentSchema() external view returns (bytes32) {
        return _missionEnrollmentSchema;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
