// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract POAPContract is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _baseTokenURI;

    constructor(string memory name, string memory symbol, string memory baseTokenURI) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }

    function mintPOAP(address recipient) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(recipient, newTokenId);
        return newTokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) public {
        _baseTokenURI = newBaseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }
}
