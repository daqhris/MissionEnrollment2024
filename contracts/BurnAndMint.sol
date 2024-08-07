// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ccip/CCIPReceiver.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IAny2EVMMessageReceiver.sol";
import "./utils/AttestationUtils.sol";
import "./utils/EthereumProviderUtils.sol";

contract BurnAndMint is CCIPReceiver, ERC721, IAny2EVMMessageReceiver {
    using Strings for uint256;

    // Define the event for the burn-and-mint operation
    event BurnAndMintOperation(uint256 indexed tokenId, address indexed receiver, uint64 destinationChainSelector);
    event AttestationSubmitted(bytes32 attestationId);

    // CCIP variables
    LinkTokenInterface private immutable i_link;
    uint64 private immutable i_destinationChainSelector;

    // Attestation and Ethereum provider variables
    mapping(bytes32 => bool) public attestations;
    address public ethereumProvider;

    constructor(
        address _link,
        uint64 _destinationChainSelector,
        address _ethereumProvider
    ) CCIPReceiver(_link) ERC721("BurnAndMint", "BAM") {
        i_link = LinkTokenInterface(_link);
        i_destinationChainSelector = _destinationChainSelector;
        ethereumProvider = _ethereumProvider;
    }

    // Function to burn the NFT on the source chain and mint on the destination chain
    function burnAndMint(uint256 tokenId, address receiver, bytes memory signature) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved or owner");

        // Submit attestation
        bytes32 attestationId = AttestationUtils.submitAttestation(tokenId, receiver, signature);
        attestations[attestationId] = true;
        emit AttestationSubmitted(attestationId);

        // Burn the NFT on the source chain
        _burn(tokenId);

        // Emit the event for the burn-and-mint operation
        emit BurnAndMintOperation(tokenId, receiver, i_destinationChainSelector);

        // Prepare and send the CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(tokenId, attestationId),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(i_link)
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

        // You might want to store or emit the messageId for tracking
    }

    // CCIP receiver function
    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (uint256 tokenId, bytes32 attestationId) = abi.decode(message.data, (uint256, bytes32));
        address receiver = abi.decode(message.sender, (address));

        require(attestations[attestationId], "Invalid attestation");

        // Convert Ethereum provider to signer
        address signer = EthereumProviderUtils.providerToSigner(ethereumProvider);

        // Mint the NFT on this chain
        _safeMint(receiver, tokenId);

        // Clear the attestation
        delete attestations[attestationId];
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
}
