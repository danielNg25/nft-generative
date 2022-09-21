import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import { NFT__factory } from "../typechain-types/factories/contracts/NFT__factory";
import { Store__factory } from "../typechain-types/factories/contracts/Store__factory";

import { NFT } from "../typechain-types/contracts/NFT";
import { Store } from "../typechain-types/contracts/Store";
async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const addresses = accounts.map(async (item) => await item.getAddress());
    const admin = addresses[0];

    //Loading contracts' factory
    const NFT: NFT__factory = <NFT__factory>await ethers.getContractFactory("NFT");
    const Store: Store__factory = <Store__factory>await ethers.getContractFactory("Store");

    // Deploy contracts
    console.log("==================================================================");
    console.log("DEPLOY CONTRACTS");
    console.log("==================================================================");

    const nft: NFT = <NFT>await NFT.deploy("NFT test", "NFT", "");
    await nft.deployed();
    console.log("NFT deployed at: ", nft.address);

    const store: Store = <Store>(
        await upgrades.deployProxy(Store, [nft.address, "1000000000000000", "10000000000000000", "100"])
    );
    await store.deployed();
    console.log("Store deployed at: ", store.address);
    const storeVerify = await upgrades.erc1967.getImplementationAddress(store.address);
    console.log("Store verify: ", storeVerify);

    const contractAddress = {
        nft: nft.address,
        store: store.address,
    };

    fs.writeFileSync("contracts.json", JSON.stringify(contractAddress));

    const contractVerifyAddress = {
        nft: nft.address,
        store: storeVerify,
    };

    fs.writeFileSync("contractVerify.json", JSON.stringify(contractVerifyAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
