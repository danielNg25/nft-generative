// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/INFT.sol";

contract NFT is
    ERC721,
    ERC721Enumerable,
    INFT,
    Ownable
{
    // Base URI
    string private _baseUri;


    mapping (address => bool) private _minter;

    event AddMinter(address indexed minter);
    event RemoveMinter(address indexed minter);

    constructor(string memory _name, string memory _symbol, string memory baseUri)
        ERC721(_name, _symbol)
    {
        _setBaseURI(baseUri);
    }

    modifier onlyMinter(){
        require(_minter[msg.sender], "Restrict to Minter");
        _;
    }

    function isMinter(address _account) public view returns(bool){
        return _minter[_account];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _setBaseURI(string memory baseUri) internal {
        _baseUri = baseUri;
    }

    function baseURI() external view returns (string memory) {
        return _baseURI();
    }

    function setURIPrefix(string memory baseUri) public onlyOwner {
        _setBaseURI(baseUri);
    }

    // /**
    //  * @dev Function to safely mint tokens.
    //  * @param receivers The address that will receive the minted token.
    //  * @param uris The uri to mint.
    //  * @return A boolean that indicates if the operation was successful.
    //  */
    // function safeMint(
    //     address[] memory receivers,
    //     string[] memory uris
    // ) public onlyMinter returns (bool) {
    //     require(
    //         receivers.length > 0 &&
    //             receivers.length == uris.length, 
    //         "Invalid input length"
    //     );

    //     for (uint256 i = 0; i < receivers.length; i++) {
    //         uint256 tokenId = totalSupply() + 1;
    //         _safeMint(receivers[i], tokenId);
    //     }
    //     return true;
    // }

    /**
     * @dev Function to safely mint tokens.
     * @param receiver The address that will receive the minted token.
     * @param tokenId The tokenId of minting NFT.
     * @return A boolean that indicates if the operation was successful.
     */
    function safeMint(
        address receiver,
        uint256 tokenId
    ) public onlyMinter returns (bool) {
        _safeMint(receiver, tokenId);
        return true;
    }
    
    /**
     * @dev Burns a specific ERC721 token.
     * @param tokenId uint256 id of the ERC721 token to be burned.
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721)
    {
        //solhint-disable-next-line max-line-length
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "caller is not owner nor approved"
        );
        _burn(tokenId);
    }

    /**
     * @dev Gets the list of token IDs of the requested owner.
     * @param owner address owning the tokens
     * @return uint256[] List of token IDs owned by the requested address
     */
    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }

    /**
     * @dev Sets minter status for specific address
     * only minter can mint this NFT
     * @param account address to set status
     * @param _isMinter status to set for address
     */
    function setMinterStatus(address account, bool _isMinter) external onlyOwner{
        _minter[account] = _isMinter;
    }
}
