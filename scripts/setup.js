const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI_ADDRESS = "0xa42f3dCCd7f215d60d7bbA39ecF7b04bc6EAcD77";
const TIME_ADDRESS = "0x850B8890587588b2f5dAC105d06B724D7e85acA2";
const STAKING_ADDRESS = "0xd8c506e098Ed486A142E77F7DBE04b0C0126d9Bb";
const STAKING_HELPER_ADDRESS = "0x0045F251D5aB97Cdd5452B1D04ad13b36Bd7Fb73";
const MEMO_ADDRESS = "0xA54918da5Fa4b605F1026A15abE99E04C7059078";
const DISTRIBUTOR_ADDRESS = "0xf078253fE6474C03743B0383DC3391c3dA6c485a";
const BONDINGCALC_ADDRESS = "0xBd7429bE3784ff3e86aAd25c3Dcb4ae26e5C9F4e";
const TREASURY_ADDRESS = "0x33eb32335C8c6657AbA6B6c57AB8CC52bF1bf9f3";
const bondAddress = "0x76fEEFDF3eF38b7a19463969fd68d15AA57c0273";
const StakingWarmupAddress = "0x76fEEFDF3eF38b7a19463969fd68d15AA57c0273";

//set
const zeroAddress = "0x0000000000000000000000000000000000000000";
const firstEpochBlock = "1647091408";
const initialMint = "3000000000000000000000000000000";
const epochLengthInBlocks = "28800";
const firstEpochNumber = "1647005008";
const controlVariable = "300";
const vestingTerm = "432000";
const minimumPrice = "120";
const maxPayout = "50";
const fee = "1000";
const maxDebt = "1000000000000000";
const Index = "4547419269";
const largeApproval = "100000000000000000000000000000000";
const initialRewardRate = "3000";
// DAI bond BCV
const daiBondBCV = "365";

// Bond vesting length in blocks. 33110 ~ 5 days
const bondVestingLength = "33110";

// Min bond price
const minBondPrice = "50";

// Max bond payout
const maxBondPayout = "500000000";

// DAO fee for bond
const bondFee = "10000";

// Max debt bond can take on
const maxBondDebt = "600000000000000";

// Initial Bond debt
const intialBondDebt = "0";
const initialDebt = "0";
const main = async () => {
    const [deployer] = await ethers.getSigners();

    let contractFactory = await hre.ethers.getContractFactory("TimeERC20Token");
    const time = contractFactory.attach(TIME_ADDRESS);

    contractFactory = await hre.ethers.getContractFactory("MEMOries");
    const memo = contractFactory.attach(MEMO_ADDRESS);

    contractFactory = await hre.ethers.getContractFactory("TimeStaking");
    const staking = contractFactory.attach(STAKING_ADDRESS);

    contractFactory = await hre.ethers.getContractFactory("TimeTreasury");
    const treasury = contractFactory.attach(TREASURY_ADDRESS);

    contractFactory = await hre.ethers.getContractFactory("TimeBondDepository");
    const daiBond = contractFactory.attach(bondAddress);

    contractFactory = await hre.ethers.getContractFactory("StakingWarmup");
    const stakingWarmup = contractFactory.attach(StakingWarmupAddress);

    contractFactory = await hre.ethers.getContractFactory("Distributor");
    const distributor = contractFactory.attach(DISTRIBUTOR_ADDRESS);
    // await ohmContract.setVault(TREASURY_ADDRESS);
    // await ohmContract.approve(STAKING_ADDRESS);
    // console.log("set ohm success");
    // await treasuryContract.queue(0, BOND_ADDRESS);
    // console.log("set treasury queue success");
    // await sOHMContract.initialize(STAKING_ADDRESS);
    // console.log("set sohm success");
    // await stakingContract.setContract(1, WARM_UP_ADDRESS);
    // console.log("set staking success");
    // await treasuryContract.toggle(0, BOND_ADDRESS, BOND_ADDRESS);
    // console.log("set treasury queue success");
    // await bondContract.setStaking(STAKING_HELPER_ADDRESS, true);
    // await bondContract.initializeBondTerms(300, 33110, 26000, 50, 10000, 600000000000000, 450000000000000);
    // console.log("set dai bond success");

    await treasury.queue("0", daiBond.address);
    await treasury.toggle("0", daiBond.address, zeroAddress);

    await daiBond.initializeBondTerms(
        daiBondBCV,
        bondVestingLength,
        minBondPrice,
        maxBondPayout,
        bondFee,
        maxBondDebt,
        intialBondDebt,
    );

    await daiBond.setStaking(staking.address, true);

    await memo.initialize(staking.address);
    await memo.setIndex(Index);
    await staking.setContract("0", distributor.address);
    await staking.setContract("1", stakingWarmup.address);
    await time.setVault(treasury.address);

    await distributor.addRecipient(staking.address, initialRewardRate);

    await treasury.queue("8", distributor.address);
    await treasury.toggle("8", distributor.address, zeroAddress);

    await treasury.queue("0", deployer.address);
    await treasury.toggle("0", deployer.address, zeroAddress);

    await treasury.queue("4", deployer.address);
    await treasury.toggle("4", deployer.address, zeroAddress);
    console.log("----------------Approve--------------------");

    // await dai.approve(treasury.address, largeApproval);
    // await time.approve(stakingHelper.address, largeApproval);
    // await dai.approve(daiBond.address, largeApproval);

    await treasury.deposit("100000000000000000000", DAI_ADDRESS, "50000000000");

    console.log(await time.balanceOf(deployer.address));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
