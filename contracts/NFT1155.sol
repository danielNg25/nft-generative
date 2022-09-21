// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT1155 is ERC1155, Ownable {
    constructor(string memory baseUri) ERC1155(baseUri) {}

    function safeMint(
        uint256 tokenId,
        address[] memory receivers,
        uint256[] memory amounts
    ) public onlyOwner {
        require(
            receivers.length > 0 && receivers.length == amounts.length,
            "Invalid input length"
        );

        for (uint256 i = 0; i < receivers.length; i++) {
            _mint(receivers[i], tokenId, amounts[i], "");
        }
    }
}
