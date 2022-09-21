// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface INFT is IERC721, IERC721Enumerable{

    
    function safeMint(
        address receiver,
        uint256 tokenId
    ) external returns (bool);

}