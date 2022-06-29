require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        // console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        ganache: {
            url: "http://127.0.0.1:7545",
        },
        // fantomtestnet: {
        //   url: "https://rpc.testnet.fantom.network",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // ethereum: {
        //   url: "https://main-light.eth.linkpool.io/",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // ICICB: {
        //   url: "https://mainnet-rpc.icicbchain.org",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // ICICBtest: {
        //   url: "https://testnet-rpc.icicbchain.org",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // bsc: {
        //   url: "https://bsc-dataseed1.ninicoin.io/",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // matic: {
        //   url: "https://rpc-mainnet.matic.quiknode.pro",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // fantom: {
        //   url: "https://rpc.ftm.tools/",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        // fantom: {
        //   url: "https://rpc.ftm.tools/",
        //   accounts: [process.env.PRIVATEKEY],
        // },
        rinkeby: {
            // url: "https://rinkeby.infura.io/v3/c7bae63096c74b3dad54ad7ae275df0c",
            url: "https://eth-rinkeby.alchemyapi.io/v2/TWCO2XsIVDteeZA6WcmHPWmMowK6SDTD",

            accounts: ["48cbd76ab7311b3c55220d65d29a30e4857918022793a2be059fb9c6980d0112"],
            // gas: 2100000,
            // gasPrice: 8000000000,
            saveDeployments: true,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: "WQKQ9RXXCTK715PKG1H7JUMV4ZEUW3KKXN",
    },
    solidity: {
        compilers: [
            {
                version: "0.8.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.7.5",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    mocha: {
        timeout: 200000,
    },
};
