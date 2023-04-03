// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract MemberPackageRegistry is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using AddressUpgradeable for address payable;

    uint256 private totalCreatorPackage;
    uint256 private totalUserPackage;
    address public royaltyFeeTo;

    // Creator package
    struct CreatorPackage {
        uint256 keyId;
        uint256 packageId;
        string name;
        uint256 price;
        address paymentToken;
        uint256 maxPackageSold;
        uint256 packageSold;
        uint256 startTime;
        uint256 endTime;
        uint256 duration;
    }

    struct CreatorPackageSubscription {
        uint256 packageId;
        uint256 expirationTime;
    }

    // mapping index to creator package
    mapping(uint256 => CreatorPackage) private creatorPackages;

    // mapping keyId to creator packageId
    mapping(uint256 => uint256) private keyIdToCreatorPackage;

    // set of active creator package
    EnumerableSetUpgradeable.UintSet private activeCreatorPackage;

    // mapping artist address to creator pack to expirations time
    mapping(address => mapping(uint256 => uint256))
        public creatorPackageExpirationTime;

    // User package
    struct UserPackage {
        uint256 keyId;
        uint256 packageId;
        string name;
        uint256 price;
        address paymentToken;
        uint256 maxPackageSold;
        uint256 packageSold;
        uint256 startTime;
        uint256 endTime;
        uint256 duration;
    }

    struct UserPackageSubscription {
        uint256 packageId;
        uint256 expirationTime;
    }
    // mapping index to user package
    mapping(uint256 => UserPackage) private userPackages;

    // mapping keyId to user packageId
    mapping(uint256 => uint256) private keyIdToUserPackage;

    // set of active user package
    EnumerableSetUpgradeable.UintSet private activeUserPackage;

    // mapping artist address to user pack to expirations time
    mapping(address => mapping(uint256 => uint256))
        public userPackageExpirationTime;

    /* ========== EVENTS ========== */
    event RoyaltyFeeToAddressChanged(address oldAddress, address newAddress);

    // Creator package events
    event CreatorPackageCreated(
        uint256 keyId,
        uint256 packageId,
        string name,
        uint256 price,
        address paymentToken,
        uint256 maxPackageSold,
        uint256 startTime,
        uint256 endTime,
        uint256 duration
    );

    event CreatorPackageUpdated(
        uint256 keyId,
        uint256 packageId,
        string name,
        uint256 price,
        address paymentToken,
        uint256 maxPackageSold,
        uint256 startTime,
        uint256 endTime,
        uint256 duration
    );

    event CreatorPackageDeleted(uint256 packageId);

    event CreatorPackSubscribed(
        address indexed userAddress,
        uint256 packageId,
        uint256 expirationTime
    );

    // User package events
    event UserPackageCreated(
        uint256 keyId,
        uint256 packageId,
        string name,
        uint256 price,
        address paymentToken,
        uint256 maxPackageSold,
        uint256 startTime,
        uint256 endTime,
        uint256 duration
    );

    event UserPackageUpdated(
        uint256 keyId,
        uint256 packageId,
        string name,
        uint256 price,
        address paymentToken,
        uint256 maxPackageSold,
        uint256 startTime,
        uint256 endTime,
        uint256 duration
    );

    event UserPackageDeleted(uint256 packageId);

    event UserPackSubscribed(
        address indexed userAddress,
        uint256 packageId,
        uint256 expirationTime
    );

    /* ========== GOVERNANCE ========== */
    /**
     * @dev Initialize function
     * must call right after contract is deployed
     */
    function initialize(address _royaltyFeeTo) public initializer {
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        royaltyFeeTo = _royaltyFeeTo;
    }

    /**
     * @dev function to set royaltyFeeTo address
     * @param _royaltyFeeTo new royaltyFeeTo address
     */
    function setRoyaltyFeeTo(address _royaltyFeeTo) external onlyOwner {
        address oldFeeTo = royaltyFeeTo;
        require(
            _royaltyFeeTo != address(0),
            "CollectionController: set to zero address"
        );
        require(
            _royaltyFeeTo != oldFeeTo,
            "CollectionController: royaltyFeeTo address set"
        );
        royaltyFeeTo = _royaltyFeeTo;
        emit RoyaltyFeeToAddressChanged(oldFeeTo, _royaltyFeeTo);
    }

    /* ========== VIEW FUNCTIONS ========== */

    // Creator Package View functions
    /**
     * @dev get active creator package
     */
    function getActiveCreatorPackageId()
        public
        view
        returns (uint256[] memory)
    {
        return activeCreatorPackage.values();
    }

    /**
     * @dev get active creator package
     */
    function getActiveCreatorPackage()
        public
        view
        returns (CreatorPackage[] memory)
    {
        uint256[] memory activePackageId = activeCreatorPackage.values();
        CreatorPackage[] memory packages = new CreatorPackage[](
            activePackageId.length
        );
        for (uint256 i = 0; i < activePackageId.length; i++) {
            packages[i] = creatorPackages[activePackageId[i]];
        }
        return packages;
    }

    /**
     * @dev get creator package by id
     * @param packageId package id to get
     */
    function getCreatorPackage(
        uint256 packageId
    ) public view returns (CreatorPackage memory package, bool isActive) {
        if (activeCreatorPackage.contains(packageId)) {
            isActive = true;
        } else {
            isActive = false;
        }

        package = creatorPackages[packageId];
    }

    /**
     * @dev get creator package by keyId
     * @param keyId keyId to get
     */
    function getCreatorPackageByKeyId(
        uint256 keyId
    ) public view returns (CreatorPackage memory package, bool isActive) {
        uint256 packageId = keyIdToCreatorPackage[keyId];
        if (activeCreatorPackage.contains(packageId)) {
            isActive = true;
        } else {
            isActive = false;
        }

        package = creatorPackages[packageId];
    }

    /**
     * @dev get creator package subscription
     * @param user user address to get subscription
     */
    function getCreatorPackageSubscription(
        address user
    ) public view returns (CreatorPackageSubscription[] memory packages) {
        for (uint256 i = 0; i < totalCreatorPackage; i++) {
            if (creatorPackageExpirationTime[user][i] > block.timestamp) {
                packages[i] = CreatorPackageSubscription(
                    i,
                    creatorPackageExpirationTime[user][i]
                );
            }
        }
        return packages;
    }

    // User Package View functions
    /**
     * @dev get active user package
     */
    function getActiveUserPackageId() public view returns (uint256[] memory) {
        return activeUserPackage.values();
    }

    /**
     * @dev get active user package
     */
    function getActiveUserPackage() public view returns (UserPackage[] memory) {
        uint256[] memory activePackageId = activeUserPackage.values();
        UserPackage[] memory packages = new UserPackage[](
            activePackageId.length
        );
        for (uint256 i = 0; i < activePackageId.length; i++) {
            packages[i] = userPackages[activePackageId[i]];
        }
        return packages;
    }

    /**
     * @dev get user package by id
     * @param packageId package id to get
     */
    function getUserPackage(
        uint256 packageId
    ) public view returns (UserPackage memory package, bool isActive) {
        if (activeUserPackage.contains(packageId)) {
            isActive = true;
        } else {
            isActive = false;
        }

        package = userPackages[packageId];
    }

    /**
     * @dev get user package by keyId
     * @param keyId keyId to get
     */
    function getUserPackageByKeyId(
        uint256 keyId
    ) public view returns (UserPackage memory package, bool isActive) {
        uint256 packageId = keyIdToUserPackage[keyId];
        if (activeUserPackage.contains(packageId)) {
            isActive = true;
        } else {
            isActive = false;
        }

        package = userPackages[packageId];
    }

    /**
     * @dev get user package subscription
     * @param user user address to get subscription
     */
    function getUserPackageSubscription(
        address user
    ) public view returns (UserPackageSubscription[] memory packages) {
        for (uint256 i = 0; i < totalUserPackage; i++) {
            if (userPackageExpirationTime[user][i] > block.timestamp) {
                packages[i] = UserPackageSubscription(
                    i,
                    userPackageExpirationTime[user][i]
                );
            }
        }
        return packages;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @dev Function to add new creator package
     * @param _keyId key to map with offchain data
     * @param _name new creator pack name
     * @param _price new creator pack price
     * @param _paymentToken new creator pack payment token
     * @param _duration new creator pack duration
     * @param _maxPackageSell new creator pack max package to sell
     * @param _startTime new creator pack start selling time
     * @param _endTime new creator pack end selling time
     */
    function addCreatorPackage(
        uint256 _keyId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) external onlyOwner {
        require(_price > 0, "CollectionController: invalid creator pack price");
        require(
            _startTime < _endTime && _endTime > block.timestamp,
            "CollectionController: invalid creator pack time"
        );
        require(
            _duration > 0,
            "CollectionController: invalid creator pack duration"
        );

        uint256 creatorPackageId = totalCreatorPackage;
        creatorPackages[creatorPackageId] = CreatorPackage(
            _keyId,
            creatorPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            0,
            _startTime,
            _endTime,
            _duration
        );

        activeCreatorPackage.add(creatorPackageId);

        emit CreatorPackageCreated(
            _keyId,
            creatorPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );
        totalCreatorPackage++;
    }

    /**
     * @dev Function to update creator package
     * @param _creatorPackageId creator pack id to update
     * @param _name new creator pack name
     * @param _price new creator pack price
     * @param _paymentToken new creator pack payment token
     * @param _duration new creator pack duration
     * @param _maxPackageSell new creator pack max package to sell
     * @param _startTime new creator pack start selling time
     * @param _endTime new creator pack end selling time
     */
    function updateCreatorPackage(
        uint256 _creatorPackageId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) external onlyOwner {
        require(
            _creatorPackageId < totalCreatorPackage,
            "CollectionController: invalid creator pack id"
        );
        require(_price > 0, "CollectionController: invalid creator pack price");
        require(
            _startTime < _endTime && _endTime > block.timestamp,
            "CollectionController: invalid creator pack time"
        );
        require(
            _duration > 0,
            "CollectionController: invalid creator pack duration"
        );

        CreatorPackage storage creatorPackage = creatorPackages[
            _creatorPackageId
        ];
        require(
            _maxPackageSell > creatorPackage.packageSold,
            "CollectionController: invalid max package sell"
        );
        creatorPackage.name = _name;
        creatorPackage.price = _price;
        creatorPackage.paymentToken = _paymentToken;
        creatorPackage.maxPackageSold = _maxPackageSell;
        creatorPackage.startTime = _startTime;
        creatorPackage.endTime = _endTime;
        creatorPackage.duration = _duration;

        if (!activeCreatorPackage.contains(_creatorPackageId)) {
            activeCreatorPackage.add(_creatorPackageId);
        }

        emit CreatorPackageUpdated(
            creatorPackage.keyId,
            _creatorPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );
    }

    /**
     * @dev Function to delete creator package
     * @param _creatorPackageId creator pack id to delete
     */
    function deleteCreatorPackage(
        uint256 _creatorPackageId
    ) external onlyOwner {
        require(
            _creatorPackageId < totalCreatorPackage &&
                activeCreatorPackage.contains(_creatorPackageId),
            "CollectionController: invalid creator pack id"
        );

        activeCreatorPackage.remove(_creatorPackageId);

        emit CreatorPackageDeleted(_creatorPackageId);
    }

    /**
     * @dev Function to add new user package
     * @param _keyId key mapping for offchain data
     * @param _name new user pack name
     * @param _price new user pack price
     * @param _paymentToken new user pack payment token
     * @param _duration new user pack duration
     * @param _maxPackageSell new user pack max package to sell
     * @param _startTime new user pack start selling time
     * @param _endTime new user pack end selling time
     */
    function addUserPackage(
        uint256 _keyId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) external onlyOwner {
        require(_price > 0, "CollectionController: invalid user pack price");
        require(
            _startTime < _endTime && _endTime > block.timestamp,
            "CollectionController: invalid user pack time"
        );
        require(
            _duration > 0,
            "CollectionController: invalid user pack duration"
        );

        uint256 userPackageId = totalUserPackage;
        userPackages[userPackageId] = UserPackage(
            _keyId,
            userPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            0,
            _startTime,
            _endTime,
            _duration
        );

        activeUserPackage.add(userPackageId);

        emit UserPackageCreated(
            _keyId,
            userPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );
        totalUserPackage++;
    }

    /**
     * @dev Function to update user package
     * @param _userPackageId user pack id to update
     * @param _name new user pack name
     * @param _price new user pack price
     * @param _paymentToken new user pack payment token
     * @param _duration new user pack duration
     * @param _maxPackageSell new user pack max package to sell
     * @param _startTime new user pack start selling time
     * @param _endTime new user pack end selling time
     */
    function updateUserPackage(
        uint256 _userPackageId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) external onlyOwner {
        require(
            _userPackageId < totalUserPackage,
            "CollectionController: invalid user pack id"
        );
        require(_price > 0, "CollectionController: invalid user pack price");
        require(
            _startTime < _endTime && _endTime > block.timestamp,
            "CollectionController: invalid user pack time"
        );
        require(
            _duration > 0,
            "CollectionController: invalid user pack duration"
        );

        UserPackage storage userPackage = userPackages[_userPackageId];
        require(
            _maxPackageSell > userPackage.packageSold,
            "CollectionController: invalid max package sell"
        );
        userPackage.name = _name;
        userPackage.price = _price;
        userPackage.paymentToken = _paymentToken;
        userPackage.maxPackageSold = _maxPackageSell;
        userPackage.startTime = _startTime;
        userPackage.endTime = _endTime;
        userPackage.duration = _duration;

        if (!activeUserPackage.contains(_userPackageId)) {
            activeUserPackage.add(_userPackageId);
        }

        emit UserPackageUpdated(
            userPackage.keyId,
            _userPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );
    }

    /**
     * @dev Function to delete user package
     * @param _userPackageId user pack id to delete
     */
    function deleteUserPackage(uint256 _userPackageId) external onlyOwner {
        require(
            _userPackageId < totalUserPackage &&
                activeUserPackage.contains(_userPackageId),
            "CollectionController: invalid user pack id"
        );

        activeUserPackage.remove(_userPackageId);

        emit UserPackageDeleted(_userPackageId);
    }

    // User functions

    /**
     * @dev Function to subscribe to creator package
     * @param _packageId ID of creator package
     */
    function subscribeCreatorPack(uint256 _packageId) external payable {
        require(
            activeCreatorPackage.contains(_packageId),
            "CollectionController: Package deleted"
        );

        CreatorPackage memory creatorPackage = creatorPackages[_packageId];

        require(
            creatorPackage.startTime <= block.timestamp,
            "CollectionController: Package not started"
        );

        require(
            creatorPackage.endTime >= block.timestamp,
            "CollectionController: Package ended"
        );

        require(
            creatorPackage.maxPackageSold == 0 ||
                creatorPackage.maxPackageSold > creatorPackage.packageSold,
            "CollectionController: Package sold out"
        );

        if (creatorPackage.paymentToken == address(0)) {
            require(
                msg.value == creatorPackage.price,
                "CollectionController: Not enough price"
            );

            payable(royaltyFeeTo).sendValue(creatorPackage.price);
        } else {
            IERC20Upgradeable(creatorPackage.paymentToken).safeTransferFrom(
                _msgSender(),
                royaltyFeeTo,
                creatorPackage.price
            );
        }

        uint256 oldExpirationTime = creatorPackageExpirationTime[_msgSender()][
            _packageId
        ];
        uint256 expirationTime;
        if (oldExpirationTime > block.timestamp) {
            expirationTime = oldExpirationTime + creatorPackage.duration;
        } else {
            expirationTime = block.timestamp + creatorPackage.duration;
        }
        creatorPackageExpirationTime[_msgSender()][_packageId] = expirationTime;
        emit CreatorPackSubscribed(_msgSender(), _packageId, expirationTime);
    }

    /**
     * @dev Function to subscribe to user package
     * @param _packageId ID of user package
     */
    function subscribeUserPack(uint256 _packageId) external payable {
        require(
            activeUserPackage.contains(_packageId),
            "CollectionController: Package deleted"
        );

        UserPackage memory userPackage = userPackages[_packageId];

        require(
            userPackage.startTime <= block.timestamp,
            "CollectionController: Package not started"
        );

        require(
            userPackage.endTime >= block.timestamp,
            "CollectionController: Package ended"
        );

        require(
            userPackage.maxPackageSold == 0 ||
                userPackage.maxPackageSold > userPackage.packageSold,
            "CollectionController: Package sold out"
        );

        if (userPackage.paymentToken == address(0)) {
            require(
                msg.value == userPackage.price,
                "CollectionController: Not enough price"
            );

            payable(royaltyFeeTo).sendValue(userPackage.price);
        } else {
            IERC20Upgradeable(userPackage.paymentToken).safeTransferFrom(
                _msgSender(),
                royaltyFeeTo,
                userPackage.price
            );
        }

        uint256 oldExpirationTime = userPackageExpirationTime[_msgSender()][
            _packageId
        ];
        uint256 expirationTime;
        if (oldExpirationTime > block.timestamp) {
            expirationTime = oldExpirationTime + userPackage.duration;
        } else {
            expirationTime = block.timestamp + userPackage.duration;
        }
        userPackageExpirationTime[_msgSender()][_packageId] = expirationTime;
        emit UserPackSubscribed(_msgSender(), _packageId, expirationTime);
    }
}
