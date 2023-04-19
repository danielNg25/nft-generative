import * as hre from 'hardhat';

async function main() {
    try {
        await hre.run('verify:verify', {
            address: '0x4671773772078a33ddAA432DC96a7e811b098b8b',
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
