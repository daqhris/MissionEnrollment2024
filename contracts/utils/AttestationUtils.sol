// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";

library AttestationUtils {
    struct EAS {
        IEAS eas;
        ISchemaRegistry schemaRegistry;
    }

    function submitAttestation(
        EAS memory eas,
        bytes32 schema,
        address receiver,
        uint256 tokenId,
        bytes memory signature
    ) internal returns (bytes32) {
        bytes memory data = abi.encode(tokenId, signature);

        IEAS.AttestationRequest memory request = IEAS.AttestationRequest({
            schema: schema,
            data: IEAS.AttestationData({
                recipient: receiver,
                expirationTime: 0, // No expiration
                revocable: true,
                refUID: bytes32(0), // No reference UID
                data: data,
                value: 0 // No value transfer
            })
        });

        return eas.eas.attest(request);
    }

    function createENSSchema(EAS memory eas) internal returns (bytes32) {
        string memory schema = "address userAddress,string ensName,uint256 registrationDate";
        return eas.schemaRegistry.register(schema, ISchemaResolver(address(0)), true);
    }

    function createPOAPSchema(EAS memory eas) internal returns (bytes32) {
        string memory schema = "address userAddress,uint256 poapTokenId,string eventName,uint256 eventDate";
        return eas.schemaRegistry.register(schema, ISchemaResolver(address(0)), true);
    }
}
