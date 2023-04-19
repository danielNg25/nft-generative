import * as hre from 'hardhat';
import * as fs from 'fs';
import { Signer } from 'ethers';
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import {
    MemberPackageRegistry__factory,
    MemberPackageRegistry,
} from '../typechain-types';

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();

    //Loading contracts' factory
    const MemberPackageRegistry: MemberPackageRegistry__factory = <
        MemberPackageRegistry__factory
    >await ethers.getContractFactory('MemberPackageRegistry');

    // Deploy contracts
    console.log(
        '=================================================================='
    );
    console.log('UPGRADE CONTRACTS');
    console.log(
        '=================================================================='
    );

    console.log('ACCOUNT: ' + admin);

    const memberPackageRegistry: MemberPackageRegistry = <
        MemberPackageRegistry
    >await upgrades.upgradeProxy(
        '0x0f99e5bad2814eb79587c1073af640b514dac581',
        MemberPackageRegistry
    );
    await memberPackageRegistry.deployed();
    const memberPackageVerify = await upgrades.erc1967.getImplementationAddress(
        memberPackageRegistry.address
    );
    console.log(
        'MemberPackageRegistry upgrade successfully at: ',
        memberPackageRegistry.address
    );
    console.log('MemberPackageRegistry verify: ', memberPackageVerify);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
