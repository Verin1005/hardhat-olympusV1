const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking factory deploy", function () {
    it("deploy", async function () {
        const [deployer] = await ethers.getSigners();

        const firstEpochBlock = "1647091408";
        const initialMint = "3000000000000000000000000000000";
        const epochLengthInBlocks = "28800";
        const firstEpochNumber = "1647005008";
        const zeroAddress = "0x0000000000000000000000000000000000000000";
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
        const DAO = await ethers.getContractFactory("MultiSigWalletWithDailyLimit");
        const dao = await DAO.deploy(
            [
                "0x2CF244aE1900DB74A9209055c2328897d48A0088",
                "0xD473C3a31f838d561d62D65c5fB9E5cECb06B3A9",
                "0x554fb9d679851B2689Dee3F0dE09251DB6BCaCa5",
            ],
            3,
            0,
        );

        // var exchangeRouter;
        // var exchangeFactory;
        // var wETH;

        // {
        //     const Factory = await ethers.getContractFactory("PancakeswapFactory");
        //     exchangeFactory = await Factory.deploy(deployer.address);
        //     await exchangeFactory.deployed();
        //     // console.log(await exchangeFactory.INIT_CODE_PAIR_HASH());

        //     // console.log("exchangeFactory", exchangeFactory.address.yellow);
        //     /* ----------- WETH -------------- */
        //     //deploy WETH contract for test
        //     const WETH = await ethers.getContractFactory("WETH9");
        //     wETH = await WETH.deploy();
        //     await wETH.deployed();

        //     // console.log("WETH", wETH.address.yellow);

        //     /* ----------- Router -------------- */
        //     //deploy Router contract for test
        //     const Router = await ethers.getContractFactory("PancakeswapRouter");
        //     exchangeRouter = await Router.deploy(exchangeFactory.address, wETH.address);
        //     await exchangeRouter.deployed();

        //     // console.log("exchangeRouter", exchangeRouter.address.yellow);
        // }

        await dao.deployed();
        // console.log("----------------DAO deploy--------------------");

        const TIME = await ethers.getContractFactory("TimeERC20Token");
        const time = await TIME.deploy();
        await time.deployed();

        // console.log("----------------TIME deploy--------------------");

        const DAI = await ethers.getContractFactory("DAI");
        const dai = await DAI.deploy(4);
        await dai.deployed();
        // console.log("---------dai balance", dai.balanceOf(deployer.address));
        await dai.mint(deployer.address, initialMint);
        // console.log("----------------DAI deploy--------------------");

        var nonce = await ethers.provider.getTransactionCount(deployer.address);
        var startTIme = new Date().getTime();
        // console.log("----------------startTIme--------------------", startTIme);

        const TREASURY = await ethers.getContractFactory("TimeTreasury");

        const treasury = await TREASURY.deploy(time.address, dai.address, dai.address, 0);
        await treasury.deployed();

        // console.log("----------------TREASURY deploy--------------------");

        const BondingCalculator = await ethers.getContractFactory("TimeBondingCalculator");

        const bondingCalculator = await BondingCalculator.deploy(time.address);

        await bondingCalculator.deployed();

        // console.log("----------------BondingCalculator deploy--------------------");

        const Distributor = await ethers.getContractFactory("Distributor");

        const distributor = await Distributor.deploy(
            treasury.address,
            time.address,
            epochLengthInBlocks,
            firstEpochBlock,
        );
        await distributor.deployed();

        // console.log("----------------Distributor deploy--------------------");

        const MEMO = await ethers.getContractFactory("MEMOries");
        const memo = await MEMO.deploy();
        await memo.deployed();

        // console.log("----------------MEMO deploy--------------------");

        const Staking = await ethers.getContractFactory("TimeStaking");
        const staking = await Staking.deploy(
            time.address,
            memo.address,
            epochLengthInBlocks,
            firstEpochNumber,
            firstEpochBlock,
        );
        await staking.deployed();

        // console.log("----------------Staking deploy--------------------");

        const StakingWarmpup = await ethers.getContractFactory("StakingWarmup");
        const stakingWarmup = await StakingWarmpup.deploy(staking.address, memo.address);

        await stakingWarmup.deployed();

        // console.log("----------------StakingWarmpup deploy--------------------");

        const StakingHelper = await ethers.getContractFactory("StakingHelper");
        const stakingHelper = await StakingHelper.deploy(staking.address, time.address);
        await stakingHelper.deployed();

        // console.log("----------------StakingHelper deploy--------------------");

        const DAIBond = await ethers.getContractFactory("TimeBondDepository");

        const daiBond = await DAIBond.deploy(time.address, dai.address, treasury.address, dao.address, zeroAddress);
        await daiBond.deployed();
        // console.log("----------------DAIBond deploy--------------------");
        console.log("--------------deploy finish----------------");

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

        await dai.approve(treasury.address, largeApproval);
        await time.approve(stakingHelper.address, largeApproval);
        await dai.approve(daiBond.address, largeApproval);

        await treasury.deposit("100000000000000000000", dai.address, "50000000000");

        console.log(await time.balanceOf(deployer.address));
        // await treasury.deposit("300000000000000000000", dai.address, "150000000000");
        // await treasury.deposit("100000000000000000000", dai.address, "50000000000");
        // await treasury.deposit("100000000000000000000", dai.address, "50000000000");
        // console.log(" time.balanceOf", String(await time.balanceOf(deployer.address)));
        // console.log(" dai.balanceOf", String(await dai.balanceOf(deployer.address)));

        console.log("debtRatio", ethers.utils.formatUnits(await daiBond.debtRatio()));

        console.log("bondPriceInUSD", ethers.utils.formatUnits(await daiBond.bondPriceInUSD()));

        await stakingHelper.stake("10000000000", deployer.address);
        console.log("---------------stakingHelper test-------------");
        let acceptedSlippage = 0.005;
        let calculatePremium = await daiBond.bondPrice();
        const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

        try {
            await daiBond.deposit("10000000000000000000", "60000", deployer.address);
            console.log("dai balance of ", await dai.balanceOf(deployer.address));
        } catch (error) {
            console.log(error);
        }
        console.log("DAI_ADDRESS: ", dai.address);
        console.log("TIME_ADDRESS: ", time.address);
        console.log("STAKING_ADDRESS: ", staking.address);
        console.log("STAKING_HELPER_ADDRESS: ", stakingHelper.address);
        console.log("MEMO_ADDRESS: ", memo.address);
        console.log("DISTRIBUTOR_ADDRESS: ", distributor.address);
        console.log("BONDINGCALC_ADDRESS: ", bondingCalculator.address);
        console.log("TREASURY_ADDRESS: ", treasury.address);
        console.log("bondAddress: ", daiBond.address);
    });
});
