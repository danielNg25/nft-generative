import * as hre from 'hardhat';

async function main() {
    try {
        await hre.run('verify:verify', {
            address: '0x3D8E8695bdE351B0b584fcb6F8a62599b20a5d8e',
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
