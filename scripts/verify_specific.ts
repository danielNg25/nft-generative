import * as hre from 'hardhat';

async function main() {
    try {
        await hre.run('verify:verify', {
            address: '0x788275C9b6cE0287A736A9aaa9bed49cc7c00948',
            constructorArguments: [],
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
