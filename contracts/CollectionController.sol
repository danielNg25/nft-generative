// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./token/NFT.sol";

/**
 * @title CollectionController
 * @author ndtr2000
 */

contract CollectionController is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;
    using AddressUpgradeable for address payable;

    address public feeTo;

    address public verifier;

    uint256 public totalCollection;

    address public royaltyFeeTo;
    uint256 public royaltyFee;

    uint256 public constant BASIS_POINT = 10000;

    struct Collection {
        uint256 keyId;
        address artist;
        address collectionAddress;
        address paymentToken;
        uint256 mintCap;
        uint256 startTime;
        uint256 endTime;
    }

    // mapping index to collection
    mapping(uint256 => Collection) public collections;

    // mapping of minted layer id hash
    mapping(bytes => bool) private layerHashes;

    // mapping used signature
    mapping(bytes => bool) private invalidSignatures;

    // mapping owner address to own collections set
    mapping(address => EnumerableSetUpgradeable.UintSet)
        private artistToCollection;

    /* ========== EVENTS ========== */

    event FeeToAddressChanged(address oldAddress, address newAddress);
    event VerifierAddressChanged(address oldAddress, address newAddress);
    event RoyaltyFeeToAddressChanged(address oldAddress, address newAddress);
    event RoyaltyFeeChanged(uint256 oldFee, uint256 newFee);

    event CollectionCreated(
        uint256 keyId,
        uint256 collectionId,
        string name,
        string symbol,
        string baseUri,
        address artist,
        address collectionAddress,
        address paymentToken,
        uint256 mintCap
    );
    event MintCapUpdated(
        uint256 indexed collectionId,
        uint256 oldMintCap,
        uint256 newMintCap
    );
    event StartTimeUpdated(
        uint256 indexed collectionId,
        uint256 oldStartTime,
        uint256 newStartTime
    );
    event EndTimeUpdated(
        uint256 indexed collectionId,
        uint256 oldEndTime,
        uint256 newEndTime
    );
    event NFTMinted(
        uint256 indexed collectionId,
        address collectionAddress,
        address receiver,
        string uri,
        uint256 tokenId,
        uint256 royaltyFee
    );

    /* ========== MODIFIERS ========== */

    /* ========== GOVERNANCE ========== */

    /**
     * @dev Initialize function
     * must call right after contract is deployed
     * @param _feeTo address to receive revenue
     * @param _verifier address to verify signature
     * @param _royaltyFeeTo address to receive royalty fee
     * @param _royaltyFee percent of royalty fee received in basis point of 10000
     */
    function initialize(
        address _feeTo,
        address _verifier,
        address _royaltyFeeTo,
        uint256 _royaltyFee
    ) public initializer {
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        feeTo = _feeTo;
        verifier = _verifier;
        royaltyFeeTo = _royaltyFeeTo;
        royaltyFee = _royaltyFee;
    }

    /**
     * @dev function to whitelist NFTs that set their whitelist status to true
     * @param name name of collection
     * @param symbol collection's symbol
     * @param baseUri collection's base metadata uri
     * @param paymentToken payment token address to mint NFT from this collection
     *
     * Emits {CollectionCreated}
     *
     */
    function createCollection(
        uint256 keyId,
        string memory name,
        string memory symbol,
        string memory baseUri,
        address paymentToken,
        uint256 mintCap,
        uint256 startTime,
        uint256 endTime,
        uint256 signatureExpTime,
        bytes memory signature
    ) external {
        require(
            invalidSignatures[signature] == false &&
                verifyCollectionCreationMessage(
                    keyId,
                    msg.sender,
                    name,
                    symbol,
                    baseUri,
                    paymentToken,
                    mintCap,
                    startTime,
                    endTime,
                    signatureExpTime,
                    signature
                ),
            "CollectionController: invalid signature"
        );

        require(
            signatureExpTime > block.timestamp,
            "CollectionController: signature expired"
        );
        require(
            startTime > block.timestamp || startTime == 0,
            "CollectionController: invalid start time"
        );
        require(
            endTime > startTime || endTime == 0,
            "CollectionController: invalid end time"
        );
        NFT newNFT = new NFT(name, symbol, baseUri);
        address collectionAddress = address(newNFT);
        totalCollection++;
        collections[totalCollection] = Collection(
            keyId,
            _msgSender(),
            collectionAddress,
            paymentToken,
            mintCap,
            startTime,
            endTime
        );
        artistToCollection[_msgSender()].add(totalCollection);
        invalidSignatures[signature] = true;
        emit CollectionCreated(
            keyId,
            totalCollection,
            name,
            symbol,
            baseUri,
            _msgSender(),
            collectionAddress,
            paymentToken,
            mintCap
        );
    }

    /**
     * @dev function to mint NFT from a collection
     * @param collectionId ID of collection to mint
     * @param uri uris of minted NFT
     *
     * Emits {CollectionMinted} events indicating NFTs minted
     *
     * Requirements:
     *
     * - length of 'receivers' and 'uris' must be the same
     * - transfer enough minting cost
     */
    function mintNFT(
        uint256 collectionId,
        string memory uri,
        uint256 fee,
        bytes memory layerHash,
        uint256 signatureExpTime,
        bytes memory signature
    ) external payable nonReentrant {
        require(
            invalidSignatures[signature] == false &&
                verifyMessage(
                    collectionId,
                    _msgSender(),
                    fee,
                    uri,
                    layerHash,
                    signatureExpTime,
                    signature
                ),
            "CollectionController: invalid signature"
        );
        require(
            signatureExpTime > block.timestamp,
            "CollectionController: signature expired"
        );

        require(
            !layerHashes[layerHash],
            "CollectionController: Layer combination already minted"
        );
        Collection memory collection = collections[collectionId];
        require(
            collection.startTime <= block.timestamp,
            "CollectionController: collection not started yet"
        );
        require(
            collection.endTime > block.timestamp || collection.endTime == 0,
            "CollectionController: collection ended"
        );

        NFT nft = NFT(collection.collectionAddress);
        uint256 royaltyFeeAmount = (fee * royaltyFee) / BASIS_POINT;
        if (collection.paymentToken == address(0)) {
            require(msg.value == fee, "CollectionController: wrong fee");

            payable(feeTo).sendValue(fee - royaltyFeeAmount);
            payable(royaltyFeeTo).sendValue(royaltyFeeAmount);
        } else {
            IERC20Upgradeable(collection.paymentToken).safeTransferFrom(
                _msgSender(),
                feeTo,
                fee - royaltyFeeAmount
            );
            IERC20Upgradeable(collection.paymentToken).safeTransferFrom(
                _msgSender(),
                royaltyFeeTo,
                royaltyFeeAmount
            );
        }
        uint256 tokenId = nft.totalSupply() + 1;
        require(
            tokenId <= collection.mintCap,
            "CollectionController: max total supply exeeds"
        );

        nft.mint(_msgSender(), uri);
        layerHashes[layerHash] = true;
        invalidSignatures[signature] = true;
        emit NFTMinted(
            collectionId,
            collection.collectionAddress,
            _msgSender(),
            uri,
            tokenId,
            royaltyFeeAmount
        );
    }

    /**
     * @dev Function to withdraw balance from this smart contract
     * @param token address of token to withdraw
     */
    function withdraw(address token) external onlyOwner nonReentrant {
        if (token == address(0)) {
            payable(_msgSender()).sendValue(address(this).balance);
        } else {
            IERC20Upgradeable(token).safeTransfer(
                _msgSender(),
                IERC20Upgradeable(token).balanceOf(address(this))
            );
        }
    }

    /* ========== VIEW FUNCTIONS ========== */
    /**
     * @dev Returns all collectionID of an artist
     * @param artist artist address to view
     */
    function collectionsByArtist(
        address artist
    ) public view returns (uint256[] memory) {
        return artistToCollection[artist].values();
    }

    /**
     * @dev Returns NFT detail by collectionId and TokenId
     */
    function getNFTInfo(
        uint256 collectionId,
        uint256 tokenId
    ) public view returns (address, string memory) {
        Collection memory collection = collections[collectionId];
        NFT nFT = NFT(collection.collectionAddress);
        string memory uri = nFT.tokenURI(tokenId);
        address tokenOwner = nFT.ownerOf(tokenId);
        return (tokenOwner, uri);
    }

    /**
     * @dev check if layer combination is minted
     */
    function isLayerMinted(bytes memory layerHash) public view returns (bool) {
        return layerHashes[layerHash];
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @dev function to set mintCap to collection
     * @param collectionId id of collection to set
     * @param _mintCap new mint capability to set
     *
     * Emits {MintCapUpdated} events indicating payment changed
     *
     */
    function updateMintCap(uint256 collectionId, uint256 _mintCap) external {
        Collection memory collection = collections[collectionId];

        require(
            _msgSender() == collection.artist,
            "CollectionController: caller is not collection artist"
        );
        require(
            _mintCap != collection.mintCap &&
                _mintCap > NFT(collection.collectionAddress).totalSupply(),
            "CollectionController: invalid mint capability"
        );

        emit MintCapUpdated(collectionId, collection.mintCap, _mintCap);

        collection.mintCap = _mintCap;
        collections[collectionId] = collection;
    }

    /**
     * @dev function to set mintCap to collection
     * @param collectionId id of collection to set
     * @param _startTime new startTime to set
     *
     * Emits {MintCapUpdated} events indicating payment changed
     *
     */
    function updateStartTime(
        uint256 collectionId,
        uint256 _startTime
    ) external {
        Collection memory collection = collections[collectionId];

        require(
            _msgSender() == collection.artist,
            "CollectionController: caller is not collection artist"
        );
        require(
            collection.startTime > block.timestamp,
            "CollectionController: collection already started"
        );
        require(
            _startTime > block.timestamp,
            "CollectionController: invalid start time"
        );

        emit StartTimeUpdated(collectionId, collection.startTime, _startTime);

        collection.startTime = _startTime;
        collections[collectionId] = collection;
    }

    /**
     * @dev function to set mintCap to collection
     * @param collectionId id of collection to set
     * @param _endTime new startTime to set
     *
     * Emits {MintCapUpdated} events indicating payment changed
     *
     */
    function updateEndTime(uint256 collectionId, uint256 _endTime) external {
        Collection memory collection = collections[collectionId];

        require(
            _msgSender() == collection.artist,
            "CollectionController: caller is not collection artist"
        );
        require(
            collection.startTime > block.timestamp,
            "CollectionController: collection already started"
        );
        require(
            _endTime > collection.startTime || _endTime == 0,
            "CollectionController: invalid end time"
        );

        emit EndTimeUpdated(collectionId, collection.endTime, _endTime);

        collection.endTime = _endTime;
        collections[collectionId] = collection;
    }

    /**
     * @dev function to set feeTo address
     * @param _feeTo new feeTo address
     */
    function setFeeTo(address _feeTo) external onlyOwner {
        address oldFeeTo = feeTo;
        require(
            _feeTo != address(0),
            "CollectionController: set to zero address"
        );
        require(_feeTo != oldFeeTo, "CollectionController: feeTo address set");
        feeTo = _feeTo;
        emit FeeToAddressChanged(oldFeeTo, _feeTo);
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

    /**
     * @dev function to set royaltyFee address
     * @param _royaltyFee new royaltyFee percent
     */
    function setRoyaltyFee(uint256 _royaltyFee) external onlyOwner {
        uint256 oldFee = royaltyFee;
        require(
            royaltyFee < BASIS_POINT,
            "CollectionController: royaltyFee too large"
        );
        require(_royaltyFee != oldFee, "CollectionController: royaltyFee set");
        royaltyFee = _royaltyFee;
        emit RoyaltyFeeChanged(oldFee, _royaltyFee);
    }

    /**
     * @dev function to set feeTo address
     * @param _verifier new feeTo address
     */
    function setVerifier(address _verifier) external onlyOwner {
        address oldVerifier = verifier;
        require(
            _verifier != address(0),
            "CollectionController: set to zero address"
        );
        require(
            _verifier != oldVerifier,
            "CollectionController: feeTo address set"
        );
        verifier = _verifier;
        emit VerifierAddressChanged(oldVerifier, _verifier);
    }

    /* ========== SIGNATURE FUNCTIONS ========== */

    function verifyMessage(
        uint256 collectionID,
        address sender,
        uint256 fee,
        string memory uri,
        bytes memory layerHash,
        uint256 signatureExpTime,
        bytes memory signature
    ) private view returns (bool) {
        bytes32 dataHash = encodeData(
            collectionID,
            sender,
            fee,
            uri,
            layerHash,
            signatureExpTime
        );
        bytes32 signHash = ECDSA.toEthSignedMessageHash(dataHash);
        address recovered = ECDSA.recover(signHash, signature);
        return recovered == verifier;
    }

    function encodeData(
        uint256 collectionID,
        address sender,
        uint256 fee,
        string memory uri,
        bytes memory layerHash,
        uint256 signatureExpTime
    ) private view returns (bytes32) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return
            keccak256(
                abi.encode(
                    id,
                    collectionID,
                    sender,
                    fee,
                    uri,
                    layerHash,
                    signatureExpTime
                )
            );
    }

    function verifyCollectionCreationMessage(
        uint256 keyId,
        address sender,
        string memory name,
        string memory symbol,
        string memory baseUri,
        address paymentToken,
        uint256 mintCap,
        uint256 startTime,
        uint256 endTime,
        uint256 signatureExpTime,
        bytes memory signature
    ) private view returns (bool) {
        bytes32 dataHash = encodeCollectionCreationData(
            keyId,
            sender,
            name,
            symbol,
            baseUri,
            paymentToken,
            mintCap,
            startTime,
            endTime,
            signatureExpTime
        );
        bytes32 signHash = ECDSA.toEthSignedMessageHash(dataHash);
        address recovered = ECDSA.recover(signHash, signature);
        return recovered == verifier;
    }

    function encodeCollectionCreationData(
        uint256 keyId,
        address sender,
        string memory name,
        string memory symbol,
        string memory baseUri,
        address paymentToken,
        uint256 mintCap,
        uint256 startTime,
        uint256 endTime,
        uint256 signatureExpTime
    ) private view returns (bytes32) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return
            keccak256(
                abi.encode(
                    id,
                    keyId,
                    sender,
                    name,
                    symbol,
                    baseUri,
                    paymentToken,
                    mintCap,
                    startTime,
                    endTime,
                    signatureExpTime
                )
            );
    }
}
