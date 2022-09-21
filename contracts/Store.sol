// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./interfaces/INFT.sol";

/** 
* @title Store
* @author ndtr2000
* @dev This is smart contract for Shirt minting Store
*/

contract Store is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address public shirtNFTAddress;

    uint256 public shippingFee;
    uint256 public eachShirtFee; 
    uint256 public percentRoyaltyFee;
    uint256 constant PERCENT_BASIS_POINT = 10000;

    mapping (address => bool) isWhitelistNFT;
    mapping (address => address) ownerOfNFT;

    struct Shirt{
        address[] originalNFTs;
        uint256[] originalTokenIds;
        address buyer;
        uint256 shirtTokenId;
    }

    uint256 private _shirtTokenId;
    mapping (uint256 => Shirt) private  indexToShirt;
    mapping (address => uint256[]) private buyerToShirtIndexs;
   
    mapping (address => uint256) private balances;
    
    /* ========== EVENTS ========== */
    event ShirtCreated(address[] nftAddresses, uint256[] tokenIds, address buyer, uint256 shirtTokenId);
    event NFTWhitelistStatusChanged(address nftAddress, bool status);
    event NFTOwnerChanged(address nftAddress, address newOwner, address oldOwner);
    event ShirtNFTAddressChanged(address oldAddress, address newAddress);
    event ShippingFeeChanged(uint256 oldFee, uint256 newFee);
    event EachShirtFeeChanged(uint256 oldFee, uint256 newFee);
    event RoyaltyFeeChanged(uint256 oldFee,  uint256 newFee);
    /* ========== GOVERNANCE ========== */

    /**
     * @dev Initialize function
     * must call right after contract is deployed
     * @param _nft address of ShirtNFT contract
     * @param _shippingFee fee for shipping shirt to customer in Wei
     * @param _eachShirtFee price of each shirt in Wei
     * @param _percentRoyaltyFee Royalty fee for using each NFT of a creator in percentage (10000 = 100%)
     */
    function initialize(address _nft, uint256 _shippingFee, uint256 _eachShirtFee, uint256 _percentRoyaltyFee) public initializer{
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        shirtNFTAddress = _nft;
        shippingFee = _shippingFee;
        eachShirtFee = _eachShirtFee;
        percentRoyaltyFee = _percentRoyaltyFee;
    }

    /**
     * @dev function to change address of Shirt NFT contract
     * @param _shirtNFTAddress address of new NFT contract
     * Emits and {ShirtNFTAddressChanged} event indicating the changed address of Shirt NFT
     * Requirements:
     * 
     * - the caller must be the owner of this contract
     */
    function setNFTAddress(address _shirtNFTAddress) external onlyOwner{
        address oldAddress = shirtNFTAddress;
        shirtNFTAddress = _shirtNFTAddress;
        emit ShirtNFTAddressChanged(oldAddress, _shirtNFTAddress);
        
    }

    /**
     * @dev Function to set fee for shipping for each shirt
     * @param _shippingFee new shipping fee in Wei
     * Emits a {ShippingFeeChanged} event indicating the changed shipping fee
     * 
     * Requirements:
     *
     * - the caller must be the owner of this contract
     */
    function setShippingFee(uint256 _shippingFee) external onlyOwner{
        uint256 oldShippingFee = shippingFee;
        shippingFee = _shippingFee;
        emit ShippingFeeChanged(oldShippingFee, _shippingFee);
    }

    /**
     * @dev Function to set price of each shirt
     * @param _eachShirtFee new shirt price in Wei
     * Emits a {ShippingFeeChanged} event indicating the changed shirt price
     * 
     * Requirements:
     *
     * - the caller must be the owner of this contract
     */
    function setEachShirtFee(uint256 _eachShirtFee) external onlyOwner{
        uint256 oldShirtFee = eachShirtFee;
        eachShirtFee = _eachShirtFee;
        emit EachShirtFeeChanged(oldShirtFee, _eachShirtFee);
    }

    /**
     * @dev Function to set percentage of royalty fee of each NFT
     * @param _percentRoyaltyFee new royalty fee percentage (10000 = 100%)
     * Emits a {ShippingFeeChanged} event indicating the changed royalty fee
     * 
     * Requirements:
     *
     * - the caller must be the owner of this contract
     */
    function setPercentRoyaltyFee(uint256 _percentRoyaltyFee) external onlyOwner{
        percentRoyaltyFee = _percentRoyaltyFee;
    }

    /**
    * @dev function to whitelist NFTs that set their whitelist status to true
    * @param _nftAddresses array of NFTs' address want to whitelist
    * @param _nftOwners array of owners of corresponding NFT
    * 
    * Emits {NFTWhitelistStatusChanged} & {NFTOwnerChanged} events indicating the changed
    * NFT whitelist status & NFT owner
    *
    * Requirements:
    *
    * - the caller must be the owner of this contract
    * - `_nftAddresses`'s length must be equal to `_nftOwners`'s length
    */
    function whitelistNFT(address[] memory _nftAddresses, address[] memory _nftOwners) external onlyOwner{
        uint256 _length = _nftAddresses.length;
        require(_length == _nftOwners.length, "Invalid length");
        for (uint256 i = 0; i < _length; i++){
            _changeNFTWhitelistStatus(_nftAddresses[i], true);
            _setNFTOwner(_nftAddresses[i], _nftOwners[i]);
        }
    }

    /**
    * @dev function to change NFTs' whitelist status
    * @param _nftAddresses array of NFTs' address
    * @param _status array of corresponding NFTs' status
    * 
    * Emits {NFTWhitelistStatusChanged} events indicating the changed
    * NFT whitelist status
    *
    * Requirements:
    *
    * - the caller must be the owner of this contract
    * - owner of NFT in _nftAddresses must be set
    * - `_nftAddresses`'s length must be equal to `_status`'s length
    */
    function changeNFTWhitelistStatus(address[] memory _nftAddresses, bool[] memory _status) external onlyOwner{
        uint256 _length = _nftAddresses.length;
        require(_length == _status.length, "Invalid length");
        for (uint256 i = 0; i < _length; i++){
            require(ownerOfNFT[_nftAddresses[i]] != address(0), "NFT Owner has not been set");
            _changeNFTWhitelistStatus(_nftAddresses[i], _status[i]);
        }
    }
    
    /**
    * @dev function to change NFTs' whitelist status
    * @param _nftAddresses array of NFTs' address
    * @param _nftOwners array of corresponding NFTs' owner
    * 
    * Emits {NFTOwnerChanged} events indicating the changed
    * NFT owner status
    *
    * Requirements:
    *
    * - the caller must be the owner of this contract
    * - `_nftAddresses`'s length must be equal to `_nftOwners`'s length
    */
    function setNFTOwner(address[] memory _nftAddresses, address[] memory _nftOwners)external onlyOwner{
        uint256 _length = _nftAddresses.length;
        require(_length == _nftOwners.length, "Invalid length");
        for (uint256 i = 0; i < _length; i++){
            _setNFTOwner(_nftAddresses[i], _nftOwners[i]);
        }
    }
    /**
    * @dev function to change an NFT's whitelist status
    * @param _nftAddress NFT's address to change
    * @param _status status to change
    * 
    * Emits {NFTWhitelistStatusChanged} events indicating the changed
    * NFT whitelist status
    *
    */
    function _changeNFTWhitelistStatus(address _nftAddress, bool _status) internal{
        isWhitelistNFT[_nftAddress] = _status;
        emit NFTWhitelistStatusChanged(_nftAddress, _status);
    }

    /**
    * @dev function to change an NFT's owner status
    * @param _nftAddress NFT's address to change
    * @param _nftOwner owner's address
    * 
    * Emits {NFTOwnerChanged} events indicating the changed
    * NFT owner address
    *
    */
    function _setNFTOwner(address _nftAddress, address _nftOwner) internal{
        address oldAddress = ownerOfNFT[_nftAddress];
        ownerOfNFT[_nftAddress] = _nftOwner;
        emit NFTOwnerChanged(_nftAddress, _nftOwner, oldAddress);
    }
    /* ========== VIEW FUNCTIONS ========== */

    /**
     * @dev Returns the amount in Wei owned by `_account` in this contract
     */
    function balanceOf(address _account)public view returns(uint256){
        return balances[_account];
    }

    /**
     * @dev Function to get the status of `_nftAddress` in this contract
     * @return owner owner of `_nftAddress`
     * @return status whitelist status of `_nftAddress`
     */
    function getNFTStatus(address _nftAddress)public view returns(address owner, bool status){
        return (ownerOfNFT[_nftAddress], isWhitelistNFT[_nftAddress]);
    }

    /**
     * @dev Function to estimate the cost for buying shirts
     * @param _nftAddresses 2 dimentions array of used NFT
     * each row is list of NFT address used in 1 shirt
     * @param _tokenIds corressponding tokenId of NFT
     * @return cost the cost for buy shirts in Wei
     *
     * Requirements:
     *
     * - `_nftAddresses`'s length must be equal to `_tokenIds`'s length
     */
    function estimateCost(address[][] memory _nftAddresses, uint256[][] memory _tokenIds) view public returns(uint256 cost){
        uint256 _numberOfShirt = _nftAddresses.length;
        require(_numberOfShirt == _tokenIds.length, "Invalid length");
        uint256 _numberOfNFT = 0;
        for (uint256 i = 0; i < _numberOfShirt; i++){
            _numberOfNFT += _nftAddresses[i].length;
        }
        cost = _numberOfShirt * eachShirtFee + _numberOfShirt * eachShirtFee * percentRoyaltyFee / PERCENT_BASIS_POINT + shippingFee;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    /**
     * @dev function to buy shirt and mint shirts NFT
     * @param _nftAddresses 2 dimentions array of used NFT
     * each row is list of NFT address used in 1 shirt
     * @param _tokenIds corresponding tokenId of each NFT
     * 
     * Emits {ShirtCreated} events indicating someone bought shirts and 
     * mint ShirtNFTs
     *
     * Requirements:
     *
     * - msg.value must be equal to the cost that calculated by {estimateCost} function  
     * - `_nftAddresses`'s length must be equal to `_tokenIds`'s length   
     */
    function buyShirt(address[][] memory _nftAddresses, uint256[][] memory _tokenIds) payable external nonReentrant{
        uint256 _numberOfShirt = _nftAddresses.length;
        require (_numberOfShirt == _tokenIds.length, "Invalid length");
        
        uint256 cost = estimateCost(_nftAddresses, _tokenIds);
        require(msg.value == cost, "Wrong value");
        uint256 royaltyFee = eachShirtFee * percentRoyaltyFee / PERCENT_BASIS_POINT;
        for (uint256 i = 0; i < _numberOfShirt ; i++){
            uint256 _numberOfNFTs = _nftAddresses[i].length;
            require(_numberOfNFTs == _tokenIds[i].length, "Invalid length");
            for(uint256 j = 0; j < _numberOfNFTs; j++){
                require(isWhitelistNFT[_nftAddresses[i][j]], "NFT has not been whitelisted");
                balances[ownerOfNFT[_nftAddresses[i][j]]] += royaltyFee;
            }
            _buyShirt(_nftAddresses[i], _tokenIds[i]);
        }
        balances[address(this)] += _numberOfShirt * eachShirtFee + shippingFee;
    }

    /**
     * @dev function to buy shirt and mint shirt NFT
     * @param _nftAddresses array of used NFTs in this shirt
     * @param _tokenIds corresponding tokenId of each NFT
     * 
     * Emits a {ShirtCreated} event indicating someone bought shirt and 
     * mint ShirtNFT
     *
     * Requirements:
     *
     * - `_nftAddresses`'s length must be equal to `_tokenIds`'s length     
     */
    function _buyShirt(address[] memory _nftAddresses, uint256[] memory _tokenIds) internal{
        Shirt memory newShirt = Shirt(_nftAddresses, _tokenIds, msg.sender, _shirtTokenId);
        bool minted = INFT(shirtNFTAddress).safeMint(msg.sender, _shirtTokenId);
        require(minted, "Failed to mint NFT");
        indexToShirt[_shirtTokenId] = newShirt;
        buyerToShirtIndexs[msg.sender].push(_shirtTokenId);
        emit ShirtCreated(_nftAddresses, _tokenIds, msg.sender, _shirtTokenId);
        _shirtTokenId++;
    }

    /**
     * @dev Function to withdraw balance from this smart contract
     */
    function withDraw() external nonReentrant{
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool sent,) = msg.sender.call{value: amount}("");
        require(sent, "Failed to withdraw");
    }

    /**
     * @dev Function to withdraw shirt fee balance fromthis smart contract
     * 
     * Requirements:
     * 
     * - the caller must be the owner of this contract
     */
    function withDrawShirtFee() external onlyOwner nonReentrant{
        uint256 amount = balances[address(this)];
        balances[address(this)] = 0;
        (bool sent,) = msg.sender.call{value: amount}("");
        require(sent, "Failed to withdraw");
    }
}