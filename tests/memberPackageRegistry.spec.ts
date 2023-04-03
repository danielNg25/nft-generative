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
                        86400
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
                        86400
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
                        0
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
                        0
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
                        0
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
                    86400
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
                    86400
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
                    86400
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
                    86400
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

            await expect(
                memberPackageRegistry
                    .connect(owner)
                    .updateCreatorPackage(
                        0,
                        'Super Standard',
                        parseEther('0.002'),
                        ethers.constants.AddressZero,
                        0,
                        timestamp,
                        timestamp + 86400,
                        864000
                    )
            ).to.be.revertedWith('PackageRegistry: invalid max package sell');
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
                    0,
                    'Standard',
                    parseEther('0.001'),
                    ethers.constants.AddressZero,
                    100,
                    timestamp,
                    timestamp + 86400,
                    86400
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
                    86400
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

            let memberPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(memberPackages.length).to.equal(1);
            const memberPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(memberPackage.isActive).to.equal(false);
            await memberPackageRegistry
                .connect(owner)
                .deactiveCreatorPackage(1);

            memberPackages =
                await memberPackageRegistry.getActiveCreatorPackage();
            expect(memberPackages.length).to.equal(0);
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
                    86400
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
                    86400
                );
        });

        it('Should subscribe creator package failed', async () => {
            await expect(
                memberPackageRegistry.connect(user1).subscribeCreatorPack(0)
            ).to.be.revertedWith('PackageRegistry: Not enough price');

            await expect(
                memberPackageRegistry.connect(user1).subscribeCreatorPack(2)
            ).to.be.revertedWith('PackageRegistry: Invalid creator package id');

            await expect(
                memberPackageRegistry.connect(user1).subscribeCreatorPack(1)
            ).to.be.revertedWith('PackageRegistry: Package not started');

            await memberPackageRegistry.deactiveCreatorPackage(0);
            await expect(
                memberPackageRegistry.connect(user1).subscribeCreatorPack(0)
            ).to.be.revertedWith('PackageRegistry: Package deactived');

            await skipTime(86500, ethers);
            await expect(
                memberPackageRegistry.connect(user1).subscribeCreatorPack(1)
            ).to.be.revertedWith('PackageRegistry: Package ended');
        });

        it('Should subscribe creator package successfully', async () => {
            let timestamp = (await ethers.provider.getBlock('latest'))
                .timestamp;
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPack(0, { value: parseEther('0.001') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            let creatorPackage = await memberPackageRegistry.getCreatorPackage(
                0
            );
            expect(creatorPackage.package.packageSold).to.equal(1);
            let creatorPackageSubscripts =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscripts.length).to.equal(1);
            expect(creatorPackageSubscripts[0].packageId).to.equal(0);
            let expirationTime = timestamp + 86400 + 1;
            expect(creatorPackageSubscripts[0].expirationTime).to.equal(
                expirationTime
            );

            await skipTime(2000, ethers);
            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPack(1, { value: parseEther('0.002') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.002'), parseEther('0.002')]
            );
            creatorPackage = await memberPackageRegistry.getCreatorPackage(1);
            expect(creatorPackage.package.packageSold).to.equal(1);
            creatorPackageSubscripts =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscripts.length).to.equal(2);
            expect(creatorPackageSubscripts[1].packageId).to.equal(1);

            await expect(
                memberPackageRegistry
                    .connect(user1)
                    .subscribeCreatorPack(0, { value: parseEther('0.001') })
            ).to.changeEtherBalances(
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            creatorPackage = await memberPackageRegistry.getCreatorPackage(0);
            expect(creatorPackage.package.packageSold).to.equal(2);
            creatorPackageSubscripts =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscripts.length).to.equal(2);
            expect(creatorPackageSubscripts[0].packageId).to.equal(0);
            expect(creatorPackageSubscripts[0].expirationTime).to.equal(
                expirationTime + 86400
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
                memberPackageRegistry.connect(user1).subscribeCreatorPack(0)
            ).to.changeTokenBalances(
                mockERC20,
                [user1.address, feeTo.address],
                [parseEther('-0.001'), parseEther('0.001')]
            );
            let creatorPackageSubscripts =
                await memberPackageRegistry.getCreatorPackageSubscription(
                    user1.address
                );
            expect(creatorPackageSubscripts.length).to.equal(1);
            expect(creatorPackageSubscripts[0].packageId).to.equal(0);
            expect(creatorPackageSubscripts[0].expirationTime).to.equal(
                timestamp + 86400 + 1
            );

            await expect(
                memberPackageRegistry.connect(user2).subscribeCreatorPack(0)
            ).to.be.revertedWith('PackageRegistry: Package sold out');
        });
    });

    describe('Add UserPackage', () => {});
});
