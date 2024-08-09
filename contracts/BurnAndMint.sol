// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IAny2EVMMessageReceiver.sol";
import "./utils/AttestationUtils.sol";
import "./utils/EthereumProviderUtils.sol";

contract BurnAndMint is CCIPReceiver, ERC721, IAny2EVMMessageReceiver, Ownable {
    using Strings for uint256;

    // Define the event for the burn-and-mint operation
    event BurnAndMintOperation(uint256 indexed tokenId, address indexed receiver, uint64 destinationChainSelector);
    event AttestationSubmitted(bytes32 attestationId);
    event CCIPMessageSent(bytes32 messageId);

    // CCIP variables
    LinkTokenInterface private immutable i_link;
    uint64 private immutable i_destinationChainSelector;
    uint64 private immutable i_sourceChainSelector;

    // Attestation and Ethereum provider variables
    mapping(bytes32 => bool) public attestations;
    address public ethereumProvider;

    // Mapping to store pending migrations
    mapping(bytes32 => bool) public pendingMigrations;

    // AttestationUtils contract
    AttestationUtils.EAS private eas;

    constructor(
        address _link,
        uint64 _sourceChainSelector,
        uint64 _destinationChainSelector,
        address _ethereumProvider,
        address _easContract,
        address _schemaRegistry
    ) CCIPReceiver(_link) ERC721("BurnAndMint", "BAM") {
        i_link = LinkTokenInterface(_link);
        i_sourceChainSelector = _sourceChainSelector;
        i_destinationChainSelector = _destinationChainSelector;
        ethereumProvider = _ethereumProvider;
        eas = AttestationUtils.EAS({
            eas: IEAS(_easContract),
            schemaRegistry: ISchemaRegistry(_schemaRegistry)
        });
    }

    // Function to burn the NFT on the source chain and mint on the destination chain
    function burnAndMint(uint256 tokenId, address receiver) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved or owner");

        // Verify onchain attestation
        bytes32 attestationId = AttestationUtils.submitAttestation(
            eas,
            AttestationUtils.createENSSchema(eas),
            receiver,
            tokenId,
            ""
        );
        require(attestations[attestationId], "Attestation not verified");

        // Burn the NFT on the source chain
        _burn(tokenId);

        // Emit the event for the burn-and-mint operation
        emit BurnAndMintOperation(tokenId, receiver, i_destinationChainSelector);

        // Prepare and send the CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(tokenId, attestationId),
            tokenAmounts: new Client.EVMTokenAmount[](1),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})
            ),
            feeToken: address(i_link)
        });

        // Set the token amount for the NFT
        message.tokenAmounts[0] = Client.EVMTokenAmount({
            token: address(this),
            amount: 1
        });

        uint256 fees = IRouterClient(this.getRouter()).getFee(
            i_destinationChainSelector,
            message
        );

        i_link.approve(address(this.getRouter()), fees);

        bytes32 messageId = IRouterClient(this.getRouter()).ccipSend(
            i_destinationChainSelector,
            message
        );

        pendingMigrations[messageId] = true;
        emit CCIPMessageSent(messageId);
    }

    // CCIP receiver function
    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        require(message.sourceChainSelector == i_sourceChainSelector, "Invalid source chain");

        (uint256 tokenId, bytes32 attestationId) = abi.decode(message.data, (uint256, bytes32));
        address receiver = abi.decode(message.sender, (address));

        require(attestations[attestationId], "Invalid attestation");

        // Mint the NFT on this chain
        _safeMint(receiver, tokenId);

        // Clear the attestation and pending migration
        delete attestations[attestationId];
        delete pendingMigrations[message.messageId];
    }

    // Implement the ccipReceive function from IAny2EVMMessageReceiver
    function ccipReceive(Client.Any2EVMMessage calldata message) external override {
        require(msg.sender == address(this.getRouter()), "Sender must be the OffRamp router");
        _ccipReceive(message);
    }

    // Override the _burn function to implement the burn logic
    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);
    }

    // Function to update the Ethereum provider
    function setEthereumProvider(address _newProvider) external onlyOwner {
        ethereumProvider = _newProvider;
    }

    // Function to check if a migration is pending
    function isMigrationPending(bytes32 messageId) public view returns (bool) {
        return pendingMigrations[messageId];
    }
}
