import * as hre from 'hardhat';
const network = hre.network.name;
import * as contracts from '../contracts.json';

async function main() {
    try {
        await hre.run('verify:verify', {
            address: contracts.controllerVerify,
            constructorArguments: [],
        });
    } catch (err) {
        console.log('err >>', err);
    }

    try {
        await hre.run('verify:verify', {
            address: contracts.controller,
            hre,
        });
    } catch (err) {
        console.log('err >>', err);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
