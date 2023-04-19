import * as hre from 'hardhat';
import * as fs from 'fs';
import { Signer } from 'ethers';
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import {
    CollectionController__factory,
    CollectionController,
} from '../typechain-types';

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();

    //Loading contracts' factory
    const CollectionController: CollectionController__factory = <
        CollectionController__factory
    >await ethers.getContractFactory('CollectionController');

    // Deploy contracts
    console.log(
        '=================================================================='
    );
    console.log('UPGRADE CONTRACTS');
    console.log(
        '=================================================================='
    );

    console.log('ACCOUNT: ' + admin);

    const controller: CollectionController = <CollectionController>(
        await upgrades.upgradeProxy(
            '0xDb0d142373a516698aC90f9a63AB65347f67edBe',
            CollectionController
        )
    );
    await controller.deployed();
    const controllerVerify = await upgrades.erc1967.getImplementationAddress(
        controller.address
    );
    console.log(
        'CollectionController upgrade successfully at: ',
        controller.address
    );
    console.log('CollectionController verify: ', controllerVerify);
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
