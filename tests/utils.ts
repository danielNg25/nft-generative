export const skipTime = async (s: number, ethers: any) => {
    await ethers.provider.send('evm_increaseTime', [s]);
    ethers.provider.send('evm_mine', []);
};
