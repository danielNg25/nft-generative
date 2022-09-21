import * as hre from "hardhat";
import * as contracts from "../contractVerify.json";

async function main() {
    try {
        await hre.run("verify:verify", {
            address: contracts.nft,
            constructorArguments: ["NFT test", "NFT", ""],
        });
    } catch (err) {
        console.log("err >>", err);
    }

    try {
        await hre.run("verify:verify", {
            address: contracts.store,
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
