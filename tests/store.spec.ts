import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import { CollectionController__factory } from "../typechain-types/factories/contracts/CollectionController__factory";
import { NFT__factory } from "../typechain-types/factories/contracts/token/NFT__factory";
import { ERC20Token__factory } from "../typechain-types/factories/contracts/token/MockERC20.sol/ERC20Token__factory";

import { NFT } from "../typechain-types/contracts/token/NFT";
import { CollectionController } from "../typechain-types/contracts/CollectionController";
import { ERC20Token } from "../typechain-types/contracts/token/MockERC20.sol/ERC20Token";

import { parseEther } from "ethers/lib/utils";

describe("CollectionController", () => {
    const PERCENT_BASIS_POINT = BigNumber.from("10000");
    const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
    const VERIFIER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let feeTo: SignerWithAddress;
    let collectionController: CollectionController;
    let mockToken: ERC20Token;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        feeTo = accounts[3];
        const MockTokenFactory: ERC20Token__factory = <ERC20Token__factory>(
            await ethers.getContractFactory("ERC20Token")
        );
        const NFTFactory: NFT__factory = <NFT__factory>await ethers.getContractFactory("NFT");
        const ControllerFactory: CollectionController__factory = <CollectionController__factory>(
            await ethers.getContractFactory("CollectionController")
        );

        collectionController = <CollectionController>await ControllerFactory.deploy();
        await collectionController.initialize(feeTo.address, VERIFIER_ADDRESS);

        mockToken = <ERC20Token>await MockTokenFactory.deploy();
        await mockToken.mint(owner.address, parseEther("10"));
        await mockToken.mint(user1.address, parseEther("10"));

        await mockToken.approve(collectionController.address, ethers.constants.MaxUint256);
        await mockToken.connect(user1).approve(collectionController.address, ethers.constants.MaxUint256);
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await collectionController.verifier()).to.equal(VERIFIER_ADDRESS);
            expect(await collectionController.feeTo()).to.equal(feeTo.address);
        });
    });

    describe("Create collection", () => {
        it("Should create successfully", async () => {
            let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    "Var NFT Collection",
                    "VAR",
                    "",
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2
                );

            const totalCollection = await collectionController.totalCollection();
            expect(totalCollection).to.equal(1);

            const collection = await collectionController.collections(1);
            expect(collection.artist).to.equal(user1.address);
            expect(collection.paymentToken).to.equal(ADDRESS_ZERO);
            expect(collection.mintCap).to.equal(1000);
            expect(collection.startTime).to.equal(timestamp + 86400);
            expect(collection.endTime).to.equal(timestamp + 86400 * 2);
        });

        it("Should create successfully - endTime = 0", async () => {
            let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await collectionController
                .connect(user1)
                .createCollection(1, "Var NFT Collection", "VAR", "", ADDRESS_ZERO, 1000, timestamp + 86400, 0);

            const totalCollection = await collectionController.totalCollection();
            expect(totalCollection).to.equal(1);

            const collection = await collectionController.collections(1);
            expect(collection.artist).to.equal(user1.address);
            expect(collection.paymentToken).to.equal(ADDRESS_ZERO);
            expect(collection.mintCap).to.equal(1000);
            expect(collection.startTime).to.equal(timestamp + 86400);
            expect(collection.endTime).to.equal(0);
        });
    });

    describe("Mint NFT - native token", () => {
        const FEE = parseEther("0.1");
        let SIGNATURE: string;
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock("latest")).timestamp;
            SIGNATURE = await signatureData(1, user1.address, FEE, 1);
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    "Var NFT Collection",
                    "VAR",
                    "",
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2
                );
        });

        it("Should failed", async () => {
            await expect(
                collectionController.connect(user1).mintNFT(1, "", FEE, SIGNATURE, { value: FEE })
            ).to.revertedWith("CollectionController: collection not started yet");

            await ethers.provider.send("evm_increaseTime", [86400]);
            ethers.provider.send("evm_mine", []);

            await expect(collectionController.mintNFT(1, "", FEE, SIGNATURE, { value: FEE.sub(1) })).to.revertedWith(
                "CollectionController: wrong fee"
            );
            let wrongSig = await signatureData(2, user1.address, FEE, 1);
            await expect(collectionController.mintNFT(1, "", FEE, wrongSig, { value: FEE })).to.revertedWith(
                "CollectionController: invalid signature"
            );

            await ethers.provider.send("evm_increaseTime", [86400]);
            ethers.provider.send("evm_mine", []);

            await expect(collectionController.mintNFT(1, "", FEE, SIGNATURE, { value: FEE })).to.revertedWith(
                "CollectionController: collection ended"
            );
        });

        it("Should mint successfully", async () => {
            await ethers.provider.send("evm_increaseTime", [86400]);
            ethers.provider.send("evm_mine", []);

            await expect(() =>
                collectionController.connect(user1).mintNFT(1, "", FEE, SIGNATURE, { value: FEE })
            ).to.changeEtherBalances([user1, feeTo], [FEE.mul(-1), FEE]);

            const collection = await collectionController.collections(1);
            const NFTFactory: NFT__factory = <NFT__factory>await ethers.getContractFactory("NFT");
            const nFT = NFTFactory.attach(collection.collectionAddress);

            expect(await nFT.ownerOf(1)).to.equal(user1.address);

            await ethers.provider.send("evm_increaseTime", [86400]);
            ethers.provider.send("evm_mine", []);

            await expect(
                collectionController.connect(user1).mintNFT(1, "", FEE, SIGNATURE, { value: FEE })
            ).to.revertedWith("CollectionController: collection ended");
        });
    });

    describe("Mint NFT - ERC20 token", () => {
        const FEE = parseEther("0.1");
        let SIGNATURE: string;
        beforeEach(async () => {
            let timestamp = (await ethers.provider.getBlock("latest")).timestamp;

            SIGNATURE = await signatureData(1, user1.address, FEE, 1);
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    "Var NFT Collection",
                    "VAR",
                    "",
                    mockToken.address,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2
                );

            await ethers.provider.send("evm_increaseTime", [86400]);
            ethers.provider.send("evm_mine", []);
        });

        it("Should mint successfully", async () => {
            await expect(() =>
                collectionController.connect(user1).mintNFT(1, "hehe", FEE, SIGNATURE, { value: FEE })
            ).to.changeTokenBalances(mockToken, [user1, feeTo], [FEE.mul(-1), FEE]);

            const collection = await collectionController.collections(1);
            const NFTFactory: NFT__factory = <NFT__factory>await ethers.getContractFactory("NFT");
            const nFT = NFTFactory.attach(collection.collectionAddress);

            expect(await nFT.ownerOf(1)).to.equal(user1.address);

            let returnData = await collectionController.getNFTInfo(1, 1);
            expect(returnData[0]).to.equal(user1.address);
            expect(returnData[1]).to.equal("hehe");
        });
    });

    describe("Update Collection", () => {
        let timestamp: number;
        beforeEach(async () => {
            timestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await collectionController
                .connect(user1)
                .createCollection(
                    1,
                    "Var NFT Collection",
                    "VAR",
                    "",
                    ADDRESS_ZERO,
                    1000,
                    timestamp + 86400,
                    timestamp + 86400 * 2
                );
        });
        it("Should update successfully", async () => {
            await collectionController.connect(user1).updateMintCap(1, 10000);
            await collectionController.connect(user1).updateStartTime(1, timestamp + 3600);
            await collectionController.connect(user1).updateEndTime(1, timestamp + 3700);

            let collection = await collectionController.collections(1);
            expect(collection.mintCap).to.equal(10000);
            expect(collection.startTime).to.equal(timestamp + 3600);
            expect(collection.endTime).to.equal(timestamp + 3700);

            await collectionController.connect(user1).updateEndTime(1, 0);
            collection = await collectionController.collections(1);
            expect(collection.endTime).to.equal(0);
        });
    });
});

async function signatureData(collectionId: number, sender: string, fee: BigNumber, tokenId: number) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeData(chainId, collectionId, sender, fee, tokenId);

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodeData(chainId: number, collectionId: number, sender: string, fee: BigNumber, tokenId: number) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "address", "uint256", "uint256"],
        [chainId, collectionId, sender, fee, tokenId]
    );
    return ethers.utils.keccak256(payload);
}
