import * as hre from 'hardhat';
import * as fs from 'fs';
import { Signer } from 'ethers';
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import {
    CollectionController__factory,
    MemberPackageRegistry__factory,
    CollectionController,
    MemberPackageRegistry,
} from '../typechain-types';

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();

    //Loading contracts' factory
    const CollectionController: CollectionController__factory = <
        CollectionController__factory
    >await ethers.getContractFactory('CollectionController');

    const MemberPackageRegistry: MemberPackageRegistry__factory = <
        MemberPackageRegistry__factory
    >await ethers.getContractFactory('MemberPackageRegistry');

    // Deploy contracts
    console.log(
        '=================================================================='
    );
    console.log('DEPLOY CONTRACTS');
    console.log(
        '=================================================================='
    );

    console.log('ACCOUNT: ' + admin);

    const controller: CollectionController = <CollectionController>(
        await upgrades.deployProxy(CollectionController, [
            admin,
            admin,
            admin,
            1000,
        ])
    );
    await controller.deployed();
    console.log('Controller deployed at: ', controller.address);
    const memberPackageRegistry: MemberPackageRegistry = <
        MemberPackageRegistry
    >await upgrades.deployProxy(MemberPackageRegistry, [admin]);
    await memberPackageRegistry.deployed();
    console.log(
        'MemberPackageRegistry deployed at: ',
        memberPackageRegistry.address
    );
    const controllerVerify = await upgrades.erc1967.getImplementationAddress(
        controller.address
    );

    console.log('Controller verify: ', controllerVerify);
    const packageRegistryVerify =
        await upgrades.erc1967.getImplementationAddress(
            memberPackageRegistry.address
        );

    console.log('PackageRegistry verify: ', packageRegistryVerify);

    const contractAddress = {
        controller: controller.address,
        controllerVerify: controllerVerify,
        memberPackageRegistry: memberPackageRegistry.address,
        packageRegistryVerify: packageRegistryVerify,
    };

    fs.writeFileSync('contracts.json', JSON.stringify(contractAddress));
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
