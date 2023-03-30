import * as hre from 'hardhat';
import * as fs from 'fs';
import { Signer } from 'ethers';
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import { CollectionController__factory } from '../typechain-types/factories/contracts/CollectionController__factory';
import { NFT__factory } from '../typechain-types/factories/contracts/token/NFT__factory';
import { ERC20Token__factory } from '../typechain-types/factories/contracts/token/MockERC20.sol/ERC20Token__factory';

import { NFT } from '../typechain-types/contracts/token/NFT';
import { CollectionController } from '../typechain-types/contracts/CollectionController';
import { ERC20Token } from '../typechain-types/contracts/token/MockERC20.sol/ERC20Token';

import { parseEther } from 'ethers/lib/utils';

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
    const controllerVerify = await upgrades.erc1967.getImplementationAddress(
        controller.address
    );

    await controller.addMemberPackage(
        'Standard',
        parseEther('0.001'),
        ethers.constants.AddressZero,
        2592000
    );
    await delay(5000);
    await controller.addMemberPackage(
        'Pro',
        parseEther('0.002'),
        ethers.constants.AddressZero,
        2592000
    );
    console.log('Controller verify: ', controllerVerify);

    const contractAddress = {
        controller: controller.address,
        controllerVerify: controllerVerify,
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
