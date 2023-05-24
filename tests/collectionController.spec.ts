import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import {
    CollectionController__factory,
    NFT__factory,
    ERC20Token__factory,
    CollectionController,
    ERC20Token,
} from '../typechain-types';

import { parseEther } from 'ethers/lib/utils';
import { skipTime } from './utils';

describe('CollectionController', () => {
    const PERCENT_BASIS_POINT = BigNumber.from('10000');
    const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
    const VERIFIER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const ROYALTY_FEE = BigNumber.from(1000);
    const UPGRADE_FEE = BigNumber.from(500);
    const PREMIUM_PACKAGE_PRICE = parseEther('0.001');

    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let feeTo: SignerWithAddress;
    let collectionController: CollectionController;
    let mockToken: ERC20Token;

    let NFTFactory: NFT__factory;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        feeTo = accounts[3];
        const MockTokenFactory: ERC20Token__factory = <ERC20Token__factory>(
            await ethers.getContractFactory('ERC20Token')
        );
        NFTFactory = <NFT__factory>(
            await ethers.getContractFactory('NFT')
        );
        const ControllerFactory: CollectionController__factory = <
            CollectionController__factory
            >await ethers.getContractFactory('CollectionController');

        collectionController = <CollectionController>(
            await ControllerFactory.deploy()
        );
        await collectionController.initialize(
            feeTo.address,
            VERIFIER_ADDRESS,
            ROYALTY_FEE,
            UPGRADE_FEE,
            ADDRESS_ZERO
        );

        mockToken = <ERC20Token>await MockTokenFactory.deploy();
        await mockToken.mint(owner.address, parseEther('10'));
        await mockToken.mint(user1.address, parseEther('10'));

        await mockToken.approve(
            collectionController.address,
            ethers.constants.MaxUint256
        );
        await mockToken
            .connect(user1)
            .approve(collectionController.address, ethers.constants.MaxUint256);
    });

    describe('Deployment', () => {
        it('Should deploy successfully', async () => {
            expect(await collectionController.verifier()).to.equal(
                VERIFIER_ADDRESS
            );
            expect(await collectionController.feeTo()).to.equal(feeTo.address);
            describe('CollectionController', () => {

            })
        });
    });

    describe('Create collection', () => {
        it('Should create successfully - upgradeable = true', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            const FEE = parseEther('0.1');
            let signatureCollection = await signatureCollectionData(
                1,
                user1.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp + 86400,
                timestamp + 86400 * 2,
                timestamp + 86400,
                true
            );
            const tx = await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2,
                    timestamp + 86400,
                    true,
                    signatureCollection,
                );
            const totalCollection =
                await collectionController.totalCollection();
            expect(totalCollection).to.equal(1);

            const collection = await collectionController.collections(1);
            expect(collection.artist).to.equal(user1.address);
            expect(collection.paymentToken).to.equal(ADDRESS_ZERO);
            expect(collection.mintCap).to.equal(1000);
            expect(collection.startTime).to.equal(timestamp + 86400);
            expect(collection.endTime).to.equal(timestamp + 86400 * 2);
            expect(collection.upgradeable).to.equal(true);

        });

        it('Should create successfully - endTime = 0', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            let signatureCollection = signatureCollectionData(
                1,
                user1.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp + 86400,
                0,
                timestamp + 86400,
                true
            );
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    0,
                    timestamp + 86400,
                    true,
                    signatureCollection,
                );

            const totalCollection =
                await collectionController.totalCollection();
            expect(totalCollection).to.equal(1);

            const collection = await collectionController.collections(1);
            expect(collection.artist).to.equal(user1.address);
            expect(collection.paymentToken).to.equal(ADDRESS_ZERO);
            expect(collection.mintCap).to.equal(1000);
            expect(collection.startTime).to.equal(timestamp + 86400);
            expect(collection.endTime).to.equal(0);
            expect(collection.upgradeable).to.equal(true);
        });

        it('Should create successfully - upgradeable = false', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            let signatureCollection = signatureCollectionData(
                1,
                user1.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp + 86400,
                0,
                timestamp + 86400,
                false
            );
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    0,
                    timestamp + 86400,
                    false,
                    signatureCollection,
                );

            const totalCollection =
                await collectionController.totalCollection();
            expect(totalCollection).to.equal(1);

            const collection = await collectionController.collections(1);
            expect(collection.artist).to.equal(user1.address);
            expect(collection.paymentToken).to.equal(ADDRESS_ZERO);
            expect(collection.mintCap).to.equal(1000);
            expect(collection.startTime).to.equal(timestamp + 86400);
            expect(collection.endTime).to.equal(0);
            expect(collection.upgradeable).to.equal(false);
        });
        it('Should failed - paymentToken not valid', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            let signatureCollection = signatureCollectionData(
                1,
                user1.address,
                'Var NFT Collection',
                'VAR',
                '',
                mockToken.address,
                1000,
                timestamp + 86400,
                0,
                timestamp + 86400,
                false
            );
            await expect(collectionController
                .connect(user1)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    mockToken.address,
                    1000,
                    timestamp + 86400,
                    0,
                    timestamp + 86400,
                    false,
                    signatureCollection,
                )).to.revertedWith('GovernorFactory: invalid token payment address');
        });
    });

    describe('Mint NFT - native token', () => {
        const FEE = parseEther('0.1');
        let SIGNATURE: string;
        let signatureExpTime: number;
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            signatureExpTime = timestamp + 86400 * 3;
            SIGNATURE = await signatureData(
                1,
                user1.address,
                FEE,
                '',
                '0xabc123',
                signatureExpTime
            );
            let signatureCollection = signatureCollectionData(
                1,
                owner.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp + 86400,
                timestamp + 86400 * 2,
                timestamp + 86400 * 3,
                false
            );
            await collectionController
                .connect(owner)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2,
                    timestamp + 86400 * 3,
                    false,
                    signatureCollection,
                );
        });

        it('Should failed', async () => {
            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.revertedWith(
                'CollectionController: collection not started yet'
            );

            await skipTime(86400, ethers);

            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE.sub(1) }
                    )
            ).to.revertedWith('CollectionController: wrong fee');
            let wrongSig = await signatureData(
                2,
                user1.address,
                FEE,
                '',
                '0xabc123',
                signatureExpTime
            );
            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        wrongSig,
                        {
                            value: FEE,
                        }
                    )
            ).to.revertedWith('CollectionController: invalid signature');

            await skipTime(86400, ethers);

            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.revertedWith('CollectionController: collection ended');
        });

        it('Should mint successfully', async () => {
            await skipTime(86400, ethers);
            await expect(() =>
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.changeEtherBalances(
                [user1, owner, feeTo],
                [
                    FEE.mul(-1),
                    FEE.mul(PERCENT_BASIS_POINT.sub(ROYALTY_FEE)).div(
                        PERCENT_BASIS_POINT
                    ),
                    FEE.mul(ROYALTY_FEE).div(PERCENT_BASIS_POINT),
                ]
            );
            const [isMinted, minter] = await collectionController.isLayerMinted('0xabc123');
            expect(isMinted).to.be.true;
            expect(minter).to.equal(user1.address);

            const collection = await collectionController.collections(1);

            const nFT = NFTFactory.attach(collection.collectionAddress);
            expect(await nFT.ownerOf(1)).to.equal(user1.address);

            signatureExpTime = signatureExpTime + 864000;
            SIGNATURE = await signatureData(
                1,
                user1.address,
                FEE,
                '',
                '0xabc123',
                signatureExpTime
            );
            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.revertedWith(
                'CollectionController: Layer combination already minted'
            );
            await skipTime(86400, ethers);
            SIGNATURE = await signatureData(
                1,
                user1.address,
                FEE,
                '',
                '0xabc12321',
                signatureExpTime
            );
            await expect(
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        '',
                        FEE,
                        '0xabc12321',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.revertedWith('CollectionController: collection ended');

            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            signatureExpTime = timestamp + 86400 * 3;
            let signatureCollection = signatureCollectionData(
                1,
                owner.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                0,
                0,
                signatureExpTime,
                false
            );
            await collectionController
                .connect(owner)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    0,
                    0,
                    signatureExpTime,
                    false,
                    signatureCollection
                );

            SIGNATURE = await signatureData(
                2,
                user1.address,
                FEE,
                '',
                '0xabc1',
                signatureExpTime
            );

            await expect(() =>
                collectionController
                    .connect(user1)
                    .mintNFT(
                        2,
                        '',
                        FEE,
                        '0xabc1',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.changeEtherBalances(
                [user1, owner, feeTo],
                [
                    FEE.mul(-1),
                    FEE.mul(PERCENT_BASIS_POINT.sub(ROYALTY_FEE)).div(
                        PERCENT_BASIS_POINT
                    ),
                    FEE.mul(ROYALTY_FEE).div(PERCENT_BASIS_POINT),
                ]
            );
            const artistCollection =
                await collectionController.collectionsByArtist(owner.address);
            expect(artistCollection.length).to.equal(2);
            expect(artistCollection[0]).to.equal(1);
            expect(artistCollection[1]).to.equal(2);
        });
    });

    describe('Upgrade NFT', () => {
        const FEE = parseEther('0.1');
        let SIGNATUREFIRST: string;
        let SIGNATURESECOND: string;
        let SIGNATUREUPGRADENFT: string;
        let signatureExpTime: number;
        let timestamp: number;
        beforeEach(async () => {
            timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            signatureExpTime = timestamp + 86400;
            SIGNATUREFIRST = await signatureData(
                1,
                user1.address,
                FEE,
                'First',
                '0xabc123',
                signatureExpTime
            );
            SIGNATURESECOND = await signatureData(
                1,
                user1.address,
                FEE,
                'Second',
                '0xabc124',
                signatureExpTime
            );
            SIGNATUREUPGRADENFT = await signatureUpgradeNFTData(
                1,
                1,
                user1.address,
                FEE,
                '',
                '0xabc125',
                signatureExpTime + 86400
            );
            let signatureCollection = signatureCollectionData(
                1,
                owner.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp,
                timestamp + 86400,
                timestamp + 86400 * 2,
                true
            );

            await collectionController
                .connect(owner)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp,
                    timestamp + 86400,
                    timestamp + 86400 * 2,
                    true,
                    signatureCollection,
                );

            await collectionController
                .connect(user1)
                .mintNFT(
                    1,
                    'First',
                    FEE,
                    '0xabc123',
                    signatureExpTime,
                    SIGNATUREFIRST,
                    { value: FEE }
                );

            await collectionController
                .connect(user1)
                .mintNFT(
                    1,
                    'Second',
                    FEE,
                    '0xabc124',
                    signatureExpTime,
                    SIGNATURESECOND,
                    { value: FEE }
                );
        });

        it('Should failed', async () => {
            let signatureNonUpgradeCollection = signatureCollectionData(
                2,
                owner.address,
                'Var NFT Collection 2',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp,
                timestamp + 86400 * 2,
                timestamp + 86400,
                false
            );
            await collectionController
                .connect(owner)
                .createCollection(
                    2,
                    'Var NFT Collection 2',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp,
                    timestamp + 86400 * 2,
                    timestamp + 86400,
                    false,
                    signatureNonUpgradeCollection,
                );

            let SIGNATURE = await signatureData(
                2,
                user1.address,
                FEE,
                'First',
                '0xabc113',
                signatureExpTime
            );

            await collectionController
                .connect(user1)
                .mintNFT(
                    2,
                    'First',
                    FEE,
                    '0xabc113',
                    signatureExpTime,
                    SIGNATURE,
                    { value: FEE }
                );
            let SIGNATUREFALSEUPGRADENFT = await signatureUpgradeNFTData(
                2,
                1,
                user1.address,
                FEE,
                'Kaka',
                '0xabc112',
                signatureExpTime
            );

            await expect(
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        2,
                        1,
                        '0xabc112',
                        'Kaka',
                        FEE,
                        signatureExpTime,
                        SIGNATUREFALSEUPGRADENFT,
                    )
            ).to.revertedWith("CollectionController: non-upgradeable collection");

            const collection = await collectionController.collections(1);
            let nft = NFTFactory.attach(collection.collectionAddress);
            const tx = await nft.connect(user1).approve(collectionController.address, 1);
            tx.wait();

            await expect(
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        1,
                        1,
                        '0xabc125',
                        '',
                        FEE,
                        signatureExpTime + 86400,
                        SIGNATUREUPGRADENFT,
                        { value: FEE.sub(1) }
                    )
            ).to.revertedWith('CollectionController: wrong fee');

            let wrongSig = await signatureUpgradeNFTData(
                2,
                1,
                user1.address,
                FEE,
                '',
                '0xabc123',
                signatureExpTime
            );
            await expect(
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        2,
                        1,
                        '0xabc123',
                        'Kaka',
                        FEE,
                        signatureExpTime,
                        wrongSig,
                        {
                            value: FEE
                        }
                    )
            ).to.revertedWith('CollectionController: invalid signature');
            let mintedHashSig = await signatureUpgradeNFTData(
                1,
                1,
                user1.address,
                FEE,
                '',
                '0xabc123',
                signatureExpTime
            );
            await expect(
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        1,
                        1,
                        '0xabc123',
                        '',
                        FEE,
                        signatureExpTime,
                        mintedHashSig,
                        { value: FEE }
                    )
            ).to.revertedWith('CollectionController: Layer combination already minted');

            await skipTime(86400, ethers);
            await expect(
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        1,
                        1,
                        '0xabc125',
                        '',
                        FEE,
                        signatureExpTime + 86400,
                        SIGNATUREUPGRADENFT,
                        { value: FEE }
                    )
            ).to.revertedWith('CollectionController: collection ended');

        });

        it('Should upgrade successfully', async () => {
            const collection = await collectionController.collections(1);
            let nft = NFTFactory.attach(collection.collectionAddress);
            const tx = await nft.connect(user1).approve(collectionController.address, 1);
            tx.wait();

            let oldLayerHash = await collectionController.getLayerHash(1, 1);
            await expect(() =>
                collectionController
                    .connect(user1)
                    .upgradeNFT(
                        1,
                        1,
                        '0xabc125',
                        '',
                        FEE,
                        signatureExpTime + 86400,
                        SIGNATUREUPGRADENFT,
                        { value: FEE }
                    )
            ).to.changeEtherBalances(
                [user1, owner, feeTo],
                [
                    FEE.mul(-1),
                    FEE.mul(PERCENT_BASIS_POINT.sub(UPGRADE_FEE)).div(
                        PERCENT_BASIS_POINT
                    ),
                    FEE.mul(UPGRADE_FEE).div(PERCENT_BASIS_POINT),
                ]
            );
            let newLayerHash = await collectionController.getLayerHash(1, 1);
            expect(await nft.ownerOf(1)).to.equal(user1.address);
            const [isOldMinted, oldMinter] = await collectionController.isLayerMinted(oldLayerHash)
            const [isNewMinted, newMinter] = await collectionController.isLayerMinted(newLayerHash)
            expect(isOldMinted).to.equal(true)
            expect(isNewMinted).to.equal(true)
            expect(oldMinter).to.equal(VERIFIER_ADDRESS)
            expect(newMinter).to.equal(user1.address)
        });
    });
    //here
    describe('Mint NFT - ERC20 token', () => {
        const FEE = parseEther('0.1');
        let SIGNATURE: string;
        let signatureExpTime: number;
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            signatureExpTime = timestamp + 90000;
            SIGNATURE = await signatureData(
                1,
                user1.address,
                FEE,
                'hehe',
                '0xabc123',
                signatureExpTime
            );
            let signatureCollection = signatureCollectionData(
                1,
                owner.address,
                'Var NFT Collection',
                'VAR',
                '',
                mockToken.address,
                1000,
                timestamp + 86400,
                timestamp + 86400 * 2,
                timestamp + 86400,
                false
            );
            await collectionController.connect(owner).addPaymentToken(mockToken.address);
            await collectionController
                .connect(owner)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    mockToken.address,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2,
                    timestamp + 86400,
                    false,
                    signatureCollection
                );

            await skipTime(86400, ethers);
        });

        it('Should mint successfully', async () => {
            await expect(() =>
                collectionController
                    .connect(user1)
                    .mintNFT(
                        1,
                        'hehe',
                        FEE,
                        '0xabc123',
                        signatureExpTime,
                        SIGNATURE,
                        { value: FEE }
                    )
            ).to.changeTokenBalances(
                mockToken,
                [user1, owner, feeTo],
                [
                    FEE.mul(-1),
                    FEE.mul(PERCENT_BASIS_POINT.sub(ROYALTY_FEE)).div(
                        PERCENT_BASIS_POINT
                    ),
                    FEE.mul(ROYALTY_FEE).div(PERCENT_BASIS_POINT),
                ]
            );

            const collection = await collectionController.collections(1);
            const nFT = NFTFactory.attach(collection.collectionAddress);

            expect(await nFT.ownerOf(1)).to.equal(user1.address);

            let returnData = await collectionController.getNFTInfo(1, 1);
            expect(returnData[0]).to.equal(user1.address);
            expect(returnData[1]).to.equal('hehe');
        });
    });

    describe('Update Collection', () => {
        let timestamp: number;
        beforeEach(async () => {
            timestamp = (await ethers.provider.getBlock('latest')).timestamp;
            let signatureCollection = signatureCollectionData(
                1,
                owner.address,
                'Var NFT Collection',
                'VAR',
                '',
                ADDRESS_ZERO,
                1000,
                timestamp + 86400,
                timestamp + 86400 * 2,
                timestamp + 86400,
                false
            );
            await collectionController
                .connect(owner)
                .createCollection(
                    1,
                    'Var NFT Collection',
                    'VAR',
                    '',
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2,
                    timestamp + 86400,
                    false,
                    signatureCollection
                );
        });
        it('Should update successfully', async () => {
            await collectionController.connect(owner).updateMintCap(1, 10000);
            await collectionController
                .connect(owner)
                .updateStartTime(1, timestamp + 3600);
            await collectionController
                .connect(owner)
                .updateEndTime(1, timestamp + 3700);

            let collection = await collectionController.collections(1);
            expect(collection.mintCap).to.equal(10000);
            expect(collection.startTime).to.equal(timestamp + 3600);
            expect(collection.endTime).to.equal(timestamp + 3700);

            await collectionController.connect(owner).updateEndTime(1, 0);
            collection = await collectionController.collections(1);
            expect(collection.endTime).to.equal(0);
        });
    });

    describe('Governance', () => {
        it('Should set feeTo correctly', async () => {
            await collectionController.connect(owner).setFeeTo(user1.address);
            expect(await collectionController.feeTo()).to.equal(user1.address);
        });

        it('Should set royaltyFee correctly', async () => {
            await collectionController.connect(owner).setRoyaltyFee(100);
            expect(await collectionController.royaltyFee()).to.equal(100);
        });

        it('Should set upgradeFee correctly', async () => {
            await collectionController.connect(owner).setUpgradeFee(100);
            expect(await collectionController.upgradeFee()).to.equal(100);
        });

        it('Should add paymentToken correctly', async () => {
            expect(await collectionController.verifiedPaymentTokens(ADDRESS_ZERO)).to.equal(true);
            expect(await collectionController.verifiedPaymentTokens(mockToken.address)).to.equal(false);
            await collectionController.connect(owner).addPaymentToken(mockToken.address);
            expect(await collectionController.verifiedPaymentTokens(ADDRESS_ZERO)).to.equal(true);
            expect(await collectionController.verifiedPaymentTokens(mockToken.address)).to.equal(true);
        });

        it('Should add paymentToken incorrectly', async () => {
            await collectionController.connect(owner).addPaymentToken(mockToken.address);
            await expect(collectionController.connect(owner).addPaymentToken(mockToken.address)).to.revertedWith("CollectionController: paymentToken address exist");
        });

        it('Should set verifier correctly', async () => {
            await collectionController
                .connect(owner)
                .setVerifier(user1.address);
            expect(await collectionController.verifier()).to.equal(
                user1.address
            );
        });

        it('Should withdraw successfully', async () => {
            await mockToken
                .connect(user1)
                .transfer(collectionController.address, parseEther('1'));
            await expect(
                collectionController.connect(user1).withdraw(mockToken.address)
            ).to.revertedWith('Ownable: caller is not the owner');
            await expect(
                collectionController.withdraw(mockToken.address)
            ).to.changeTokenBalances(
                mockToken,
                [owner, collectionController],
                [parseEther('1'), parseEther('-1')]
            );

            await expect(
                collectionController.withdraw(ethers.constants.AddressZero)
            ).to.changeEtherBalances(
                [owner, collectionController],
                [parseEther('0'), parseEther('0')]
            );
        });
    });
});

async function signatureData(
    collectionId: number,
    sender: string,
    fee: BigNumber,
    uri: string,
    layerHash: string,
    signatureExpTime: number
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeData(
        chainId,
        collectionId,
        sender,
        fee,
        uri,
        layerHash,
        signatureExpTime
    );

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let wallet = new ethers.Wallet(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    );

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

async function signatureUpgradeNFTData(
    collectionId: number,
    tokenId: number,
    sender: string,
    fee: BigNumber,
    uri: string,
    newLayerHash: string,
    signatureExpTime: number
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeUpgradeNFTData(
        chainId,
        collectionId,
        tokenId,
        sender,
        fee,
        uri,
        newLayerHash,
        signatureExpTime
    );

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let wallet = new ethers.Wallet(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    );

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodeUpgradeNFTData(
    chainId: number,
    collectionId: number,
    tokenId: number,
    sender: string,
    fee: BigNumber,
    uri: string,
    newLayerHash: string,
    signatureExpTime: number
) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        [
            'uint256',
            'uint256',
            'uint256',
            'address',
            'uint256',
            'string',
            'bytes',
            'uint256',
        ],
        [chainId, collectionId, tokenId, sender, fee, uri, newLayerHash, signatureExpTime]
    );
    return ethers.utils.keccak256(payload);
}
function encodeData(
    chainId: number,
    collectionId: number,
    sender: string,
    fee: BigNumber,
    uri: string,
    layerHash: string,
    signatureExpTime: number
) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        [
            'uint256',
            'uint256',
            'address',
            'uint256',
            'string',
            'bytes',
            'uint256',
        ],
        [chainId, collectionId, sender, fee, uri, layerHash, signatureExpTime]
    );
    return ethers.utils.keccak256(payload);
}

async function signatureCollectionData(
    keyId: number,
    sender: string,
    name: string,
    symbol: string,
    baseUri: string,
    paymentToken: string,
    mintCap: number,
    startTime: number,
    endTime: number,
    signatureExpTime: number,
    upgradeable: boolean
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeCollectionData(
        chainId,
        keyId,
        sender,
        name,
        symbol,
        baseUri,
        paymentToken,
        mintCap,
        startTime,
        endTime,
        signatureExpTime,
        upgradeable
    );

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let wallet = new ethers.Wallet(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    );

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodeCollectionData(
    chainId: number,
    keyId: number,
    sender: string,
    name: string,
    symbol: string,
    baseUri: string,
    paymentToken: string,
    mintCap: number,
    startTime: number,
    endTime: number,
    signatureExpTime: number,
    upgradeable: boolean
) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        [
            'uint256',
            'uint256',
            'address',
            'string',
            'string',
            'string',
            'address',
            'uint256',
            'uint256',
            'uint256',
            'uint256',
            'bool',
        ],
        [
            chainId,
            keyId,
            sender,
            name,
            symbol,
            baseUri,
            paymentToken,
            mintCap,
            startTime,
            endTime,
            signatureExpTime,
            upgradeable
        ]
    );
    return ethers.utils.keccak256(payload);
}
