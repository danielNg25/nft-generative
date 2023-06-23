// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./libraries/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./libraries/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./libraries/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./libraries/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./libraries/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "./libraries/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./libraries/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

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
    address public feeTo;

    // Creator package
    struct MemberPackage {
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

    struct MemberPackageSubscription {
        uint256 packageId;
        uint256 expirationTime;
    }

    // mapping index to creator package
    mapping(uint256 => MemberPackage) private creatorPackages;

    // mapping keyId to creator packageId
    mapping(uint256 => uint256) private keyIdToCreatorPackage;

    // set of active creator package
    EnumerableSetUpgradeable.UintSet private activeCreatorPackages;

    // mapping artist address to creator pack to expirations time
    mapping(address => MemberPackageSubscription)
        public creatorPackageSubscription;

    // mapping index to user package
    mapping(uint256 => MemberPackage) private userPackages;

    // mapping keyId to user packageId
    mapping(uint256 => uint256) private keyIdToUserPackage;

    // set of active user package
    EnumerableSetUpgradeable.UintSet private activeUserPackages;

    // mapping user address to user pack to expirations time
    mapping(address => MemberPackageSubscription)
        public userPackageSubscription;

    /* ========== EVENTS ========== */
    event FeeToAddressChanged(address oldAddress, address newAddress);

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
        uint256 duration,
        bool isActive
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

    event CreatorPackageDeactived(uint256 packageId);
    event CreatorPackageActived(uint256 packageId);

    event CreatorPackSubscribed(
        address indexed userAddress,
        uint256 packageId,
        uint256 expirationTime,
        uint256 _quantity
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

    event UserPackageDeactived(uint256 packageId);
    event UserPackageActived(uint256 packageId);

    event UserPackSubscribed(
        address indexed userAddress,
        uint256 packageId,
        uint256 expirationTime,
        uint256 _quantity
    );

    /* ========== GOVERNANCE ========== */
    /**
     * @dev Initialize function
     * must call right after contract is deployed
     */
    function initialize(address _feeTo) public initializer {
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        feeTo = _feeTo;
    }

    /**
     * @dev function to set feeTo address
     * @param _feeTo new feeTo address
     */
    function setFeeTo(address _feeTo) external onlyOwner {
        address oldFeeTo = feeTo;
        require(_feeTo != address(0), "PackageRegistry: set to zero address");
        require(_feeTo != oldFeeTo, "PackageRegistry: feeTo address set");
        feeTo = _feeTo;
        emit FeeToAddressChanged(oldFeeTo, _feeTo);
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
        return activeCreatorPackages.values();
    }

    /**
     * @dev get active creator package
     */
    function getActiveCreatorPackage()
        public
        view
        returns (MemberPackage[] memory)
    {
        uint256[] memory activePackageId = activeCreatorPackages.values();

        return _getActiveMemberPackage(activePackageId, creatorPackages);
    }

    /**
     * @dev get creator package by id
     * @param packageId package id to get
     */
    function getCreatorPackage(
        uint256 packageId
    ) public view returns (MemberPackage memory package, bool isActive) {
        (package, isActive) = _getMemberPackageInfo(
            packageId,
            creatorPackages,
            activeCreatorPackages
        );
    }

    /**
     * @dev get creator package by keyId
     * @param keyId keyId to get
     */
    function getCreatorPackageByKeyId(
        uint256 keyId
    ) public view returns (MemberPackage memory package, bool isActive) {
        (package, isActive) = _getMemberPackageInfo(
            keyIdToCreatorPackage[keyId],
            creatorPackages,
            activeCreatorPackages
        );
    }

    /**
     * @dev get creator package subscription
     * @param user user address to get subscription
     */
    function getCreatorPackageSubscription(
        address user
    ) public view returns (MemberPackageSubscription memory) {
        return creatorPackageSubscription[user];
    }

    // User Package View functions
    /**
     * @dev get active user package
     */
    function getActiveUserPackageId() public view returns (uint256[] memory) {
        return activeUserPackages.values();
    }

    /**
     * @dev get active user package
     */
    function getActiveUserPackage()
        public
        view
        returns (MemberPackage[] memory)
    {
        uint256[] memory activePackageId = activeUserPackages.values();

        return _getActiveMemberPackage(activePackageId, userPackages);
    }

    /**
     * @dev get user package by id
     * @param packageId package id to get
     */
    function getUserPackage(
        uint256 packageId
    ) public view returns (MemberPackage memory package, bool isActive) {
        (package, isActive) = _getMemberPackageInfo(
            packageId,
            userPackages,
            activeUserPackages
        );
    }

    /**
     * @dev get user package by keyId
     * @param keyId keyId to get
     */
    function getUserPackageByKeyId(
        uint256 keyId
    ) public view returns (MemberPackage memory package, bool isActive) {
        (package, isActive) = _getMemberPackageInfo(
            keyIdToUserPackage[keyId],
            userPackages,
            activeUserPackages
        );
    }

    /**
     * @dev get user package subscription
     * @param user user address to get subscription
     */
    function getUserPackageSubscription(
        address user
    ) public view returns (MemberPackageSubscription memory) {
        return userPackageSubscription[user];
    }

    // Internal view functions
    function _getActiveMemberPackage(
        uint256[] memory activePackageIds,
        mapping(uint256 => MemberPackage) storage memberPackages
    ) internal view returns (MemberPackage[] memory) {
        MemberPackage[] memory packages = new MemberPackage[](
            activePackageIds.length
        );
        for (uint256 i = 0; i < activePackageIds.length; i++) {
            packages[i] = memberPackages[activePackageIds[i]];
        }
        return packages;
    }

    function _getMemberPackageInfo(
        uint256 packageId,
        mapping(uint256 => MemberPackage) storage memberPackages,
        EnumerableSetUpgradeable.UintSet storage activePackages
    ) internal view returns (MemberPackage memory package, bool isActive) {
        if (activePackages.contains(packageId)) {
            isActive = true;
        } else {
            isActive = false;
        }

        package = memberPackages[packageId];
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    // Creator package functions
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
        uint256 _duration,
        bool _isActive
    ) external onlyOwner {
        uint256 creatorPackageId = totalCreatorPackage;
        _addMemberPackage(
            creatorPackages,
            keyIdToCreatorPackage,
            creatorPackageId,
            _keyId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );

        if (_isActive) activeCreatorPackages.add(creatorPackageId);

        emit CreatorPackageCreated(
            _keyId,
            creatorPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration,
            _isActive
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
            "PackageRegistry: invalid creator pack id"
        );

        uint256 keyId = _updateMemberPackage(
            creatorPackages,
            activeCreatorPackages,
            _creatorPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );

        emit CreatorPackageUpdated(
            keyId,
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
     * @dev Function to deactive creator package
     * @param _creatorPackageId creator pack id to deactive
     */
    function deactiveCreatorPackage(
        uint256 _creatorPackageId
    ) external onlyOwner {
        require(
            _creatorPackageId < totalCreatorPackage,
            "PackageRegistry: invalid creator pack id"
        );
        require(
            activeCreatorPackages.contains(_creatorPackageId),
            "PackageRegistry: creator pack deactived"
        );

        activeCreatorPackages.remove(_creatorPackageId);

        emit CreatorPackageDeactived(_creatorPackageId);
    }

    /**
     * @dev Function to active creator package
     * @param _creatorPackageId creator pack id to active
     */
    function activeCreatorPackage(
        uint256 _creatorPackageId
    ) external onlyOwner {
        require(
            _creatorPackageId < totalCreatorPackage,
            "PackageRegistry: invalid creator pack id"
        );
        _activeMemberPackage(
            activeCreatorPackages,
            creatorPackages,
            _creatorPackageId
        );

        emit CreatorPackageActived(_creatorPackageId);
    }

    // User package functions
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
        uint256 _duration,
        bool _isActive
    ) external onlyOwner {
        uint256 userPackageId = totalUserPackage;
        _addMemberPackage(
            userPackages,
            keyIdToUserPackage,
            userPackageId,
            _keyId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );

        if (_isActive) activeUserPackages.add(userPackageId);

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
            "PackageRegistry: invalid user pack id"
        );
        uint256 keyId = _updateMemberPackage(
            userPackages,
            activeUserPackages,
            _userPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            _startTime,
            _endTime,
            _duration
        );

        emit UserPackageUpdated(
            keyId,
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
     * @dev Function to deactive user package
     * @param _userPackageId user pack id to deactive
     */
    function deactiveUserPackage(uint256 _userPackageId) external onlyOwner {
        require(
            _userPackageId < totalUserPackage,
            "PackageRegistry: invalid user pack id"
        );
        require(
            activeUserPackages.contains(_userPackageId),
            "PackageRegistry: user pack deactived"
        );

        activeUserPackages.remove(_userPackageId);

        emit UserPackageDeactived(_userPackageId);
    }

    /**
     * @dev Function to active user package
     * @param _userPackageId user pack id to active
     */
    function activeUserPackage(uint256 _userPackageId) external onlyOwner {
        require(
            _userPackageId < totalUserPackage,
            "PackageRegistry: invalid user pack id"
        );
        _activeMemberPackage(activeUserPackages, userPackages, _userPackageId);

        emit UserPackageActived(_userPackageId);
    }

    // User functions

    /**
     * @dev Function to subscribe to creator package
     * @param _packageId ID of creator package
     */
    function subscribeCreatorPackage(
        uint256 _packageId,
        uint256 _quantity
    ) external payable nonReentrant {
        require(
            _packageId < totalCreatorPackage,
            "PackageRegistry: Invalid creator package id"
        );

        require(
            activeCreatorPackages.contains(_packageId),
            "PackageRegistry: Package deactived"
        );

        uint256 duration = _subscribeMemberPackage(
            creatorPackages,
            _packageId,
            _quantity
        );

        uint256 expirationTime = block.timestamp + duration;
        creatorPackageSubscription[_msgSender()]
            .expirationTime = expirationTime;

        if (creatorPackageSubscription[_msgSender()].packageId != _packageId) {
            creatorPackageSubscription[_msgSender()].packageId = _packageId;
        }

        emit CreatorPackSubscribed(
            _msgSender(),
            _packageId,
            expirationTime,
            _quantity
        );
    }

    /**
     * @dev Function to subscribe to user package
     * @param _packageId ID of user package
     */
    function subscribeUserPackage(
        uint256 _packageId,
        uint256 _quantity
    ) external payable nonReentrant {
        require(
            _packageId < totalUserPackage,
            "PackageRegistry: Invalid user package id"
        );

        require(
            activeUserPackages.contains(_packageId),
            "PackageRegistry: Package deactived"
        );

        uint256 duration = _subscribeMemberPackage(
            userPackages,
            _packageId,
            _quantity
        );

        MemberPackageSubscription
            memory oldMemberPackage = userPackageSubscription[_msgSender()];

        uint256 expirationTime = 0;

        if (oldMemberPackage.packageId != _packageId) {
            userPackageSubscription[_msgSender()].packageId = _packageId;
            expirationTime = block.timestamp + duration;
        } else {
            if (oldMemberPackage.expirationTime > block.timestamp) {
                expirationTime = oldMemberPackage.expirationTime + duration;
            } else {
                expirationTime = block.timestamp + duration;
            }
        }

        userPackageSubscription[_msgSender()].expirationTime = expirationTime;

        emit UserPackSubscribed(
            _msgSender(),
            _packageId,
            expirationTime,
            _quantity
        );
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    function _addMemberPackage(
        mapping(uint256 => MemberPackage) storage _memberPackages,
        mapping(uint256 => uint256) storage _keyIdToMemberPackageId,
        uint256 _memberPackageId,
        uint256 _keyId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) internal {
        require(_price > 0, "PackageRegistry: invalid package price");
        require(
            _endTime == 0 ||
                (_startTime < _endTime && _endTime > block.timestamp),
            "PackageRegistry: invalid package time"
        );
        require(_duration > 0, "PackageRegistry: invalid package duration");
        _keyIdToMemberPackageId[_keyId] = _memberPackageId;
        _memberPackages[_memberPackageId] = MemberPackage(
            _keyId,
            _memberPackageId,
            _name,
            _price,
            _paymentToken,
            _maxPackageSell,
            0,
            _startTime,
            _endTime,
            _duration
        );
    }

    function _updateMemberPackage(
        mapping(uint256 => MemberPackage) storage _memberPackages,
        EnumerableSetUpgradeable.UintSet storage _activeMemberSet,
        uint256 _memberPackageId,
        string memory _name,
        uint256 _price,
        address _paymentToken,
        uint256 _maxPackageSell,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _duration
    ) internal returns (uint256) {
        require(_price > 0, "PackageRegistry: invalid package price");
        require(
            _endTime == 0 ||
                (_startTime < _endTime && _endTime > block.timestamp),
            "PackageRegistry: invalid package time"
        );
        require(_duration > 0, "PackageRegistry: invalid package duration");

        MemberPackage storage memberPackage = _memberPackages[_memberPackageId];
        require(
            _maxPackageSell == 0 || _maxPackageSell > memberPackage.packageSold,
            "PackageRegistry: invalid max package sell"
        );
        memberPackage.name = _name;
        memberPackage.price = _price;
        memberPackage.paymentToken = _paymentToken;
        memberPackage.maxPackageSold = _maxPackageSell;
        memberPackage.startTime = _startTime;
        memberPackage.endTime = _endTime;
        memberPackage.duration = _duration;

        if (!_activeMemberSet.contains(_memberPackageId)) {
            _activeMemberSet.add(_memberPackageId);
        }
        return memberPackage.keyId;
    }

    function _subscribeMemberPackage(
        mapping(uint256 => MemberPackage) storage _memberPackages,
        uint256 _memberPackageId,
        uint256 _quantity
    ) internal returns (uint256 duration) {
        MemberPackage memory memberPackage = _memberPackages[_memberPackageId];
        require(
            memberPackage.startTime <= block.timestamp,
            "PackageRegistry: Package not started"
        );

        require(
            memberPackage.endTime == 0 ||
                memberPackage.endTime >= block.timestamp,
            "PackageRegistry: Package ended"
        );

        require(_quantity > 0, "PackageRegistry: Invalid quantity");

        require(
            memberPackage.maxPackageSold == 0 ||
                memberPackage.maxPackageSold >=
                (memberPackage.packageSold + _quantity),
            "PackageRegistry: Package sold out"
        );
        uint256 _price = memberPackage.price * _quantity;
        if (memberPackage.paymentToken == address(0)) {
            require(msg.value == _price, "PackageRegistry: Not enough price");

            payable(feeTo).sendValue(_price);
        } else {
            IERC20Upgradeable(memberPackage.paymentToken).safeTransferFrom(
                _msgSender(),
                feeTo,
                _price
            );
        }

        _memberPackages[_memberPackageId].packageSold += _quantity;
        return memberPackage.duration * _quantity;
    }

    function _activeMemberPackage(
        EnumerableSetUpgradeable.UintSet storage _activeMemberSet,
        mapping(uint256 => MemberPackage) storage _memberPackages,
        uint256 _memberPackageId
    ) internal {
        require(
            !_activeMemberSet.contains(_memberPackageId),
            "PackageRegistry: package actived"
        );
        MemberPackage memory memberPackage = _memberPackages[_memberPackageId];
        require(
            memberPackage.endTime == 0 ||
                memberPackage.endTime > block.timestamp,
            "PackageRegistry: package expired"
        );
        require(
            memberPackage.maxPackageSold == 0 ||
                memberPackage.maxPackageSold > memberPackage.packageSold,
            "PackageRegistry: package sold out"
        );

        _activeMemberSet.add(_memberPackageId);
    }
}
