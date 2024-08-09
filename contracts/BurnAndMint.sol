// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/AttestationUtils.sol";
import "./utils/EthereumProviderUtils.sol";

contract BurnAndMint is CCIPReceiver, Ownable {
    using Strings for uint256;

    // Define the event for the burn-and-mint operation
    event BurnAndMintOperation(uint256 indexed tokenId, address indexed receiver, uint64 destinationChainSelector);
    event AttestationSubmitted(bytes32 attestationId);
    event CCIPMessageSent(bytes32 messageId);
    // ERC721 standard events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

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

    // ERC721 functionality is now inherited from the ERC721 contract

    constructor(
        address _link,
        uint64 _sourceChainSelector,
        uint64 _destinationChainSelector,
        address _ethereumProvider,
        address _easContract,
        address _schemaRegistry
    ) CCIPReceiver(_link) Ownable(msg.sender) {
        i_link = LinkTokenInterface(_link);
        i_sourceChainSelector = _sourceChainSelector;
        i_destinationChainSelector = _destinationChainSelector;
        ethereumProvider = _ethereumProvider;
        eas = AttestationUtils.EAS({
            eas: IEAS(_easContract),
            schemaRegistry: ISchemaRegistry(_schemaRegistry)
        });
    }

    // State variables for ERC721 functionality
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Implement ERC721 methods
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not token owner or approved for all"
        );
        _approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ERC721: invalid token ID");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function _safeMint(address to, uint256 tokenId) internal {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, ""), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    function _burn(uint256 tokenId) internal {
        address owner = ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function _setApprovalForAll(address owner, address operator, bool approved) internal {
        require(owner != operator, "ERC721: approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private returns (bool) {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }



    // Function to burn the NFT on the source chain and mint on the destination chain
    function burnAndMint(uint256 tokenId, address receiver) public {
        require(ownerOf(tokenId) == _msgSender() || isApprovedForAll(ownerOf(tokenId), _msgSender()) || getApproved(tokenId) == _msgSender(), "Not approved or owner");

        // Verify onchain attestation
        bytes32 attestationId = AttestationUtils.submitAttestation(
            eas,
            AttestationUtils.createENSSchema(eas),
            receiver,
            tokenId,
            ""
        );
        require(attestations[attestationId], "Attestation not verified");

        // Transfer the NFT to a burn address on the source chain
        address burnAddress = address(0x000000000000000000000000000000000000dEaD);
        safeTransferFrom(_msgSender(), burnAddress, tokenId);

        // Emit the event for the burn-and-mint operation
        emit BurnAndMintOperation(tokenId, receiver, i_destinationChainSelector);

        // Prepare and send the CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(tokenId, attestationId),
            tokenAmounts: new Client.EVMTokenAmount[](1),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000})
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
    function ccipReceive(Client.Any2EVMMessage calldata message) external override onlyRouter {
        _ccipReceive(message);
    }

    // This function has been removed as it's no longer needed

    // Function to update the Ethereum provider
    function setEthereumProvider(address _newProvider) external onlyOwner {
        ethereumProvider = _newProvider;
    }

    // Function to check if a migration is pending
    function isMigrationPending(bytes32 messageId) public view returns (bool) {
        return pendingMigrations[messageId];
    }
}
