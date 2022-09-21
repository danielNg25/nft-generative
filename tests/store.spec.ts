import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import { NFT__factory } from "../typechain-types/factories/contracts/NFT__factory";
import { Store__factory } from "../typechain-types/factories/contracts/Store__factory";

import { NFT } from "../typechain-types/contracts/NFT";
import { Store } from "../typechain-types/contracts/Store";

describe("Store", () => {
    const SHIPPING_FEE = BigNumber.from("1000000000000000");
    const EACH_SHIRT_FEE = BigNumber.from("10000000000000000");
    const ROYALTY_FEE = BigNumber.from("100");
    const PERCENT_BASIS_POINT = BigNumber.from("10000");

    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let nFT: NFT;
    let store: Store;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];

        const NFTFactory: NFT__factory = <NFT__factory>await ethers.getContractFactory("NFT");
        const StoreFactory: Store__factory = <Store__factory>await ethers.getContractFactory("Store");

        nFT = <NFT>await NFTFactory.deploy("NFT test", "NFT", "");
        store = <Store>await StoreFactory.deploy();

        await store.initialize(nFT.address, SHIPPING_FEE, EACH_SHIRT_FEE, ROYALTY_FEE);
        await nFT.setMinterStatus(store.address, true);
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await store.shirtNFTAddress()).to.equal(nFT.address);
            expect(await store.eachShirtFee()).to.equal(EACH_SHIRT_FEE);
            expect(await store.shippingFee()).to.equal(SHIPPING_FEE);
            expect(await store.percentRoyaltyFee()).to.equal(ROYALTY_FEE);

            expect(await nFT.isMinter(store.address)).to.equal(true);
        });
    });

    describe("Whitelist NFT", () => {
        it("Should catch error Invalid length", async () => {
            await expect(
                store.whitelistNFT(
                    ["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8", "0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"],
                    ["0xeD9232a61d1880816a80EE53808C1f6051e64371"]
                )
            ).to.revertedWith("Invalid length");
        });

        it("Should catch error Invalid length", async () => {
            await expect(
                store.whitelistNFT(
                    ["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"],
                    ["0xeD9232a61d1880816a80EE53808C1f6051e64371", "0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"]
                )
            ).to.revertedWith("Invalid length");
        });

        it("Should whitelist NFT successfully", async () => {
            await store.whitelistNFT(
                ["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"],
                ["0xeD9232a61d1880816a80EE53808C1f6051e64371"]
            );
            const NFTStatus = await store.getNFTStatus("0xAb6088C60C0699c1C23C0BCA298136f7782D18a8");
            expect(NFTStatus[0]).to.equal("0xeD9232a61d1880816a80EE53808C1f6051e64371");
            expect(NFTStatus[1]).to.equal(true);
        });
    });

    describe("Mint shirt", () => {
        beforeEach(async () => {
            await store.whitelistNFT(
                ["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"],
                ["0xeD9232a61d1880816a80EE53808C1f6051e64371"]
            );
        });

        it("Should mint successfully", async () => {
            const cost = await store.estimateCost([["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"]], [["0"]]);
            await store.buyShirt([["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"]], [["0"]], { value: cost });
            expect(await nFT.totalSupply()).to.equal(1);
            expect(await nFT.ownerOf("0")).to.equal(owner.address);
            expect(await store.balanceOf(store.address)).to.equal(EACH_SHIRT_FEE.mul(1).add(SHIPPING_FEE));
            expect(await store.balanceOf("0xeD9232a61d1880816a80EE53808C1f6051e64371")).to.equal(
                EACH_SHIRT_FEE.mul(ROYALTY_FEE).div(PERCENT_BASIS_POINT)
            );
        });
    });

    describe("Withdraw", () => {
        beforeEach(async () => {
            await store.whitelistNFT(["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"], [user1.address]);
            const cost = await store.estimateCost([["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"]], [["0"]]);
            await store.buyShirt([["0xAb6088C60C0699c1C23C0BCA298136f7782D18a8"]], [["0"]], { value: cost });
        });

        it("Should withdraw successfully", async () => {
            expect(await store.balanceOf(user1.address)).to.equal(
                EACH_SHIRT_FEE.mul(ROYALTY_FEE).div(PERCENT_BASIS_POINT)
            );
            await store.connect(user1).withDraw();
            expect(await store.balanceOf(user1.address)).to.equal(0);
        });

        it("Should withdraw shirt fee successfully", async () => {
            expect(await store.balanceOf(store.address)).to.equal(EACH_SHIRT_FEE.mul(1).add(SHIPPING_FEE));
            await store.withDrawShirtFee();
            expect(await store.balanceOf(store.address)).to.equal(0);
        });
    });
});
