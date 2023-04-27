import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import {
    MemberPackageRegistry,
    MemberPackageRegistry__factory,
    ERC20Token,
    ERC20Token__factory,
} from '../typechain-types';

import { parseEther } from 'ethers/lib/utils';
import { AddressType } from 'typechain';
import { skipTime } from './utils';

describe('MemberPackageRegistry', () => {
    const PREMIUM_PACKAGE_PRICE = parseEther('0.001');
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let feeTo: SignerWithAddress;
    let memberPackageRegistry: MemberPackageRegistry;
    let mockERC20: ERC20Token;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        feeTo = accounts[3];
        const MemberPackageRegistry: MemberPackageRegistry__factory = <
            MemberPackageRegistry__factory
        >await ethers.getContractFactory('MemberPackageRegistry');
        const ERC20: ERC20Token__factory = <ERC20Token__factory>(
            await ethers.getContractFactory('ERC20Token')
        );
        mockERC20 = await ERC20.deploy();

        memberPackageRegistry = await MemberPackageRegistry.deploy();
        await memberPackageRegistry.initialize(feeTo.address);

        await mockERC20.mint(user1.address, parseEther('100'));
        await mockERC20.mint(user2.address, parseEther('100'));

        await mockERC20
            .connect(user1)
            .approve(memberPackageRegistry.address, parseEther('100'));
        await mockERC20
            .connect(user2)
            .approve(memberPackageRegistry.address, parseEther('100'));
    });

    describe('Deployment', () => {
        it('Should deploy successfully', async () => {
            expect(await memberPackageRegistry.owner()).to.equal(owner.address);
        });
    });

    describe('Add CreatorPackage', () => {
        it('Should add creator package failed', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .addCreatorPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        86400,
                        true
                    )
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addCreatorPackage(
                        0,
                        'Standard',
                        0,
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        86400,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package price');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addCreatorPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp + 86500,
                        timestamp + 86400,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addCreatorPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp - 1000,
                        timestamp - 100,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addCreatorPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package duration');
        });

        it('Should add creator package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );

            const memberPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(memberPackage.package.keyId).to.equal(0);
            expect(memberPackage.package.name).to.equal('Standard');
            expect(memberPackage.package.price).to.equal(parseEther('0.001'));
            expect(memberPackage.package.paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackage.package.maxPackageSold).to.equal(100);
            expect(memberPackage.package.startTime).to.equal(timestamp);
            expect(memberPackage.package.endTime).to.equal(timestamp + 86400);
            expect(memberPackage.package.duration).to.equal(86400);
            expect(memberPackage.isActive).to.equal(true);

            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );

            const memberPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(memberPackages.length).to.equal(2);
            expect(memberPackages[1].keyId).to.equal(1);
            expect(memberPackages[1].name).to.equal('Pro');
            expect(memberPackages[1].price).to.equal(parseEther('0.002'));
            expect(memberPackages[1].paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackages[1].maxPackageSold).to.equal(100);
            expect(memberPackages[1].startTime).to.equal(timestamp);
            expect(memberPackages[1].endTime).to.equal(timestamp + 86400);
            expect(memberPackages[1].duration).to.equal(86400);
        });
    });

    describe('Update CreatorPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should update creator package failed', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .updateCreatorPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateCreatorPackage(
                        2,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid creator pack id');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateCreatorPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp + 106400,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateCreatorPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp - 10000,
                        timestamp - 1000,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');
        });

        it('Should update creator package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;

            await memberPackageRegistry
                .connect(owner)
                .updateCreatorPackage(
                    0,
                    'Super Standard',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    1000,
                    timestamp + 86400,
                    timestamp + 106400,
                    864000
                );

            const memberPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(memberPackage.package.name).to.equal('Super Standard');
            expect(memberPackage.package.price).to.equal(parseEther('0.002'));
            expect(memberPackage.package.paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackage.package.maxPackageSold).to.equal(1000);
            expect(memberPackage.package.startTime).to.equal(timestamp + 86400);
            expect(memberPackage.package.endTime).to.equal(timestamp + 106400);
            expect(memberPackage.package.duration).to.equal(864000);

            await memberPackageRegistry
                .connect(owner)
                .updateCreatorPackage(
                    1,
                    'Super Pro',
                    parseEther('0.003'),
                    mockERC20.address,
                    1000,
                    timestamp + 86400,
                    timestamp + 106400,
                    864000
                );

            const memberPackage1 =
                await memberPackageRegistry.getCreatorPackage(1);
            expect(memberPackage1.package.name).to.equal('Super Pro');
            expect(memberPackage1.package.price).to.equal(parseEther('0.003'));
            expect(memberPackage1.package.paymentToken).to.equal(
                mockERC20.address
            );
            expect(memberPackage1.package.maxPackageSold).to.equal(1000);
            expect(memberPackage1.package.startTime).to.equal(
                timestamp + 86400
            );
            expect(memberPackage1.package.endTime).to.equal(timestamp + 106400);
            expect(memberPackage1.package.duration).to.equal(864000);
        });
    });

    describe('Deactive CreatorPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    10,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should deactive creator package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).deactiveCreatorPackage(0)
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry.connect(owner).deactiveCreatorPackage(2)
            ).to.be.revertedWith('PackageRegistry: invalid creator pack id');
        });

        it('Should deactive creator package successfully', async () => {
            await memberPackageRegistry
                .connect(owner)
                .deactiveCreatorPackage(0);

            let creatorPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(creatorPackages.length).to.equal(1);
            let creatorPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(creatorPackage.isActive).to.equal(false);
            creatorPackage =
                await memberPackageRegistry.getCreatorPackageByKeyId(10);
            expect(creatorPackage.isActive).to.equal(false);
            expect(creatorPackage.package.name).to.equal('Standard');
            const creatorPackageIds =
                await memberPackageRegistry.getActiveCreatorPackageId();
            expect(creatorPackageIds.length).to.equal(1);
            expect(creatorPackageIds[0]).to.equal(1);

            await memberPackageRegistry
                .connect(owner)
                .deactiveCreatorPackage(1);

            creatorPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(creatorPackages.length).to.equal(0);
        });
    });

    describe('Active CreatorPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    10,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    1,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    false
                );
        });

        it('Should active creator package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).activeCreatorPackage(0)
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry.connect(owner).activeCreatorPackage(2)
            ).to.be.revertedWith('PackageRegistry: invalid creator pack id');

            await expect(
                memberPackageRegistry.connect(owner).activeCreatorPackage(0)
            ).to.be.revertedWith('PackageRegistry: package actived');

            await skipTime(90000, ethers);
            await expect(
                memberPackageRegistry.connect(owner).activeCreatorPackage(1)
            ).to.be.revertedWith('PackageRegistry: package expired');
        });

        it('Should active creator package successfully', async () => {
            await memberPackageRegistry.connect(owner).activeCreatorPackage(1);

            let creatorPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(creatorPackages.length).to.equal(2);
            let creatorPackage = await memberPackageRegistry.getCreatorPackage(
                1
            );
            expect(creatorPackage.isActive).to.equal(true);
            creatorPackage =
                await memberPackageRegistry.getCreatorPackageByKeyId(1);
            expect(creatorPackage.isActive).to.equal(true);
            expect(creatorPackage.package.name).to.equal('Pro');
            const creatorPackageIds =
                await memberPackageRegistry.getActiveCreatorPackageId();
            expect(creatorPackageIds.length).to.equal(2);
            expect(creatorPackageIds[0]).to.equal(0);
            expect(creatorPackageIds[1]).to.equal(1);

            await memberPackageRegistry
                .connect(user1)
                .subscribeCreatorPackage(0, 1, { value: parseEther('0.001') });

            await memberPackageRegistry
                .connect(owner)
                .deactiveCreatorPackage(0);
            await expect(
                memberPackageRegistry.connect(owner).activeCreatorPackage(0)
            ).to.be.revertedWith('PackageRegistry: package sold out');
        });
    });

    describe('Subscribe CreatorPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addCreatorPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp + 1000,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should subscribe creator package failed', async () => {
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Not enough price');

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(2, 1)
            ).to.be.revertedWith('PackageRegistry: Invalid creator package id');

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(1, 1)
            ).to.be.revertedWith('PackageRegistry: Package not started');

            await memberPackageRegistry.deactiveCreatorPackage(0);
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Package deactived');

            await skipTime(86500, ethers);
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(1, 1)
            ).to.be.revertedWith('PackageRegistry: Package ended');
        });

        it('Should subscribe creator package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(0, 1, {
                        value: parseEther('0.001'),
                    })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            let creatorPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(creatorPackage.package.packageSold).to.equal(1);
            let creatorPackageSubscript =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscript.packageId).to.equal(0);
            let expirationTime = timestamp + 86400 + 1;
            expect(creatorPackageSubscript.expirationTime).to.equal(
                expirationTime
            );

            await skipTime(2000, ethers);
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(1, 1, {
                        value: parseEther('0.002'),
                    })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.002'), parseEther('0.002')]
            );
            creatorPackage = await memberPackageRegistry.getCreatorPackage(1);
            expect(creatorPackage.package.packageSold).to.equal(1);
            creatorPackageSubscript =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscript.packageId).to.equal(1);
            timestamp = (await ethers.provider.getBlock('latest')).timestamp;
            expirationTime = timestamp + 86400 + 1;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(0, 1, {
                        value: parseEther('0.001'),
                    })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            creatorPackage = await memberPackageRegistry.getCreatorPackage(0);
            expect(creatorPackage.package.packageSold).to.equal(2);
            creatorPackageSubscript =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscript.packageId).to.equal(0);
            expect(creatorPackageSubscript.expirationTime).to.equal(
                expirationTime
            );
        });

        it('Should subscribe creator package with token successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry.updateCreatorPackage(
                0,
                'Standard',
                parseEther('0.001'),
                mockERC20.address,
                1,
                timestamp,
                timestamp + 86400,
                86400
            );
            timestamp = (await ethers.provider.getBlock('latest')).timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPackage(0, 1)
            ).to.changeTokenBalances(
                mockERC20,
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            let creatorPackageSubscript =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );

            expect(creatorPackageSubscript.packageId).to.equal(0);
            expect(creatorPackageSubscript.expirationTime).to.equal(
                timestamp + 86400 + 1
            );

            await expect(
                memberPackageRegistry
                    .connect(user2)
                    .subscribeCreatorPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Package sold out');
        });
    });

    describe('Add UserPackage', () => {
        it('Should add user package failed', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .addUserPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        86400,
                        true
                    )
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addUserPackage(
                        0,
                        'Standard',
                        0,
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        86400,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package price');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addUserPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp + 86500,
                        timestamp + 86400,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addUserPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp - 1000,
                        timestamp - 100,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .addUserPackage(
                        0,
                        'Standard',
                        parseEther('0.001'),
                        ethers.constants.AddressZero,
                        100,
                        timestamp,
                        timestamp + 86400,
                        0,
                        true
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package duration');
        });

        it('Should add user package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );

            const memberPackage = await memberPackageRegistry.getUserPackage(0);
            expect(memberPackage.package.keyId).to.equal(0);
            expect(memberPackage.package.name).to.equal('Standard');
            expect(memberPackage.package.price).to.equal(parseEther('0.001'));
            expect(memberPackage.package.paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackage.package.maxPackageSold).to.equal(100);
            expect(memberPackage.package.startTime).to.equal(timestamp);
            expect(memberPackage.package.endTime).to.equal(timestamp + 86400);
            expect(memberPackage.package.duration).to.equal(86400);
            expect(memberPackage.isActive).to.equal(true);

            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );

            const memberPackages =
                await memberPackageRegistry.getActiveUserPackage();
            expect(memberPackages.length).to.equal(2);
            expect(memberPackages[1].keyId).to.equal(1);
            expect(memberPackages[1].name).to.equal('Pro');
            expect(memberPackages[1].price).to.equal(parseEther('0.002'));
            expect(memberPackages[1].paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackages[1].maxPackageSold).to.equal(100);
            expect(memberPackages[1].startTime).to.equal(timestamp);
            expect(memberPackages[1].endTime).to.equal(timestamp + 86400);
            expect(memberPackages[1].duration).to.equal(86400);
        });
    });

    describe('Update UserPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should update user package failed', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .updateUserPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateUserPackage(
                        2,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid user pack id');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateUserPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp + 106400,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateUserPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        1000,
                        timestamp - 10000,
                        timestamp - 1000,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid package time');
        });

        it('Should update user package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;

            await memberPackageRegistry
                .connect(owner)
                .updateUserPackage(
                    0,
                    'Super Standard',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    1000,
                    timestamp + 86400,
                    timestamp + 106400,
                    864000
                );

            const memberPackage = await memberPackageRegistry.getUserPackage(0);
            expect(memberPackage.package.name).to.equal('Super Standard');
            expect(memberPackage.package.price).to.equal(parseEther('0.002'));
            expect(memberPackage.package.paymentToken).to.equal(
                ethers.constants.AddressZero
            );
            expect(memberPackage.package.maxPackageSold).to.equal(1000);
            expect(memberPackage.package.startTime).to.equal(timestamp + 86400);
            expect(memberPackage.package.endTime).to.equal(timestamp + 106400);
            expect(memberPackage.package.duration).to.equal(864000);

            await memberPackageRegistry
                .connect(owner)
                .updateUserPackage(
                    1,
                    'Super Pro',
                    parseEther('0.003'),
                    mockERC20.address,
                    1000,
                    timestamp + 86400,
                    timestamp + 106400,
                    864000
                );

            const memberPackage1 = await memberPackageRegistry.getUserPackage(
                1
            );
            expect(memberPackage1.package.name).to.equal('Super Pro');
            expect(memberPackage1.package.price).to.equal(parseEther('0.003'));
            expect(memberPackage1.package.paymentToken).to.equal(
                mockERC20.address
            );
            expect(memberPackage1.package.maxPackageSold).to.equal(1000);
            expect(memberPackage1.package.startTime).to.equal(
                timestamp + 86400
            );
            expect(memberPackage1.package.endTime).to.equal(timestamp + 106400);
            expect(memberPackage1.package.duration).to.equal(864000);
        });
    });

    describe('Deactive UserPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    10,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should deactive user package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).deactiveUserPackage(0)
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry.connect(owner).deactiveUserPackage(2)
            ).to.be.revertedWith('PackageRegistry: invalid user pack id');
        });

        it('Should deactive user package successfully', async () => {
            await memberPackageRegistry.connect(owner).deactiveUserPackage(0);

            let userPackages =
                await memberPackageRegistry.getActiveUserPackage();
            expect(userPackages.length).to.equal(1);
            let userPackage = await memberPackageRegistry.getUserPackage(0);
            expect(userPackage.isActive).to.equal(false);

            userPackage = await memberPackageRegistry.getUserPackageByKeyId(10);
            expect(userPackage.isActive).to.equal(false);
            expect(userPackage.package.name).to.equal('Standard');
            const creatorPackageIds =
                await memberPackageRegistry.getActiveUserPackageId();
            expect(creatorPackageIds.length).to.equal(1);
            expect(creatorPackageIds[0]).to.equal(1);
            await memberPackageRegistry.connect(owner).deactiveUserPackage(1);

            userPackages = await memberPackageRegistry.getActiveUserPackage();
            expect(userPackages.length).to.equal(0);
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .updateUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400
                );

            userPackages = await memberPackageRegistry.getActiveUserPackage();
            expect(userPackages.length).to.equal(1);
        });
    });

    describe('Active UserPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    10,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    1,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    false
                );
        });

        it('Should active user package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).activeUserPackage(0)
            ).to.be.revertedWith('Ownable: caller is not the owner');

            await expect(
                memberPackageRegistry.connect(owner).activeUserPackage(2)
            ).to.be.revertedWith('PackageRegistry: invalid user pack id');

            await expect(
                memberPackageRegistry.connect(owner).activeUserPackage(0)
            ).to.be.revertedWith('PackageRegistry: package actived');

            await skipTime(90000, ethers);
            await expect(
                memberPackageRegistry.connect(owner).activeUserPackage(1)
            ).to.be.revertedWith('PackageRegistry: package expired');
        });

        it('Should active user package successfully', async () => {
            await memberPackageRegistry.connect(owner).activeUserPackage(1);

            let userPackages =
                await memberPackageRegistry.getActiveUserPackage();
            expect(userPackages.length).to.equal(2);
            let userPackage = await memberPackageRegistry.getUserPackage(1);
            expect(userPackage.isActive).to.equal(true);
            userPackage = await memberPackageRegistry.getUserPackageByKeyId(1);
            expect(userPackage.isActive).to.equal(true);
            expect(userPackage.package.name).to.equal('Pro');
            const userPackageIds =
                await memberPackageRegistry.getActiveUserPackageId();
            expect(userPackageIds.length).to.equal(2);
            expect(userPackageIds[0]).to.equal(0);
            expect(userPackageIds[1]).to.equal(1);

            await memberPackageRegistry
                .connect(user1)
                .subscribeUserPackage(0, 1, { value: parseEther('0.001') });

            await memberPackageRegistry.connect(owner).deactiveUserPackage(0);
            await expect(
                memberPackageRegistry.connect(owner).activeUserPackage(0)
            ).to.be.revertedWith('PackageRegistry: package sold out');
        });
    });

    describe('Subscribe UserPackage', () => {
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400,
                    true
                );
            await memberPackageRegistry
                .connect(owner)
                .addUserPackage(
                    1,
                    'Pro',
                    parseEther('0.002'),
                    ethers.constants.AddressZero,
                    0,
                    timestamp + 1000,
                    timestamp + 86400,
                    86400,
                    true
                );
        });

        it('Should subscribe user package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Not enough price');

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeUserPackage(0, 3, { value: parseEther('0.004') })
            ).to.be.revertedWith('PackageRegistry: Not enough price');

            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(2, 1)
            ).to.be.revertedWith('PackageRegistry: Invalid user package id');

            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(1, 1)
            ).to.be.revertedWith('PackageRegistry: Package not started');

            await memberPackageRegistry.deactiveUserPackage(0);
            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Package deactived');

            await skipTime(86500, ethers);
            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(1, 1)
            ).to.be.revertedWith('PackageRegistry: Package ended');
        });

        it('Should subscribe user package successfully', async () => {
            await skipTime(2000, ethers);
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeUserPackage(1, 3, { value: parseEther('0.006') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.006'), parseEther('0.006')]
            );
            let UserPackage = await memberPackageRegistry.getUserPackage(1);
            expect(UserPackage.package.packageSold).to.equal(3);
            let UserPackageSubscripts =
                await memberPackageRegistry.getUserPackageSubscription(
                    user1.address
                );
            expect(UserPackageSubscripts.packageId).to.equal(1);
            let expirationTime = timestamp + 86400 * 3 + 1;
            expect(UserPackageSubscripts.expirationTime).to.equal(
                expirationTime
            );

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeUserPackage(0, 1, { value: parseEther('0.001') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            UserPackage = await memberPackageRegistry.getUserPackage(0);
            expect(UserPackage.package.packageSold).to.equal(1);
            UserPackageSubscripts =
                await memberPackageRegistry.getUserPackageSubscription(
                    user1.address
                );
            expect(UserPackageSubscripts.packageId).to.equal(0);
            timestamp = (await ethers.provider.getBlock('latest')).timestamp;
            expirationTime = timestamp + 86400 + 1;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeUserPackage(1, 1, { value: parseEther('0.002') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.002'), parseEther('0.002')]
            );
            UserPackage = await memberPackageRegistry.getUserPackage(1);
            expect(UserPackage.package.packageSold).to.equal(4);
            UserPackageSubscripts =
                await memberPackageRegistry.getUserPackageSubscription(
                    user1.address
                );

            expect(UserPackageSubscripts.packageId).to.equal(1);
            expect(UserPackageSubscripts.expirationTime).to.equal(
                expirationTime
            );
        });

        it('Should subscribe user package with token successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await memberPackageRegistry.updateUserPackage(
                0,
                'Standard',
                parseEther('0.001'),
                mockERC20.address,
                1,
                timestamp,
                timestamp + 86400,
                86400
            );
            timestamp = (await ethers.provider.getBlock('latest')).timestamp;
            await expect(
                memberPackageRegistry.connect(user1).subscribeUserPackage(0, 1)
            ).to.changeTokenBalances(
                mockERC20,
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            let UserPackageSubscripts =
                await memberPackageRegistry.getUserPackageSubscription(
                    user1.address
                );
            expect(UserPackageSubscripts.packageId).to.equal(0);
            expect(UserPackageSubscripts.expirationTime).to.equal(
                timestamp + 86400 + 1
            );

            await expect(
                memberPackageRegistry.connect(user2).subscribeUserPackage(0, 1)
            ).to.be.revertedWith('PackageRegistry: Package sold out');
        });
    });

    describe('Governance', () => {
        it('Should set Fee to address successfully', async () => {
            await expect(
                memberPackageRegistry.connect(user1).setFeeTo(user2.address)
            ).to.be.revertedWith('Ownable: caller is not the owner');
            await memberPackageRegistry.setFeeTo(user2.address);
            expect(await memberPackageRegistry.feeTo()).to.equal(user2.address);
        });
    });
});
