import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from "../utils/MyEpicNFT.json";
import {
    CONTRACT_ADDRESS,
    MINT_PRICE,
    RINKEBY_CHAIN_ID,
} from "../constants";


export const useApp = () => {
    const [lastTokenId, setLastTokenId] = useState(0);
    const [myLatestTokenId, setMyLatestTokenId] = useState();
    const [isRinkebyTestNetwork, setRinkebyTestNetwork] = useState(false);
    const [currentChainId, setCurrentChainId] = useState("");
    const [inProgress, setInProgress] = useState(false);

    /*
     * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
     */
    const [currentAccount, setCurrentAccount] = useState("");
    /*この段階でcurrentAccountの中身は空*/
    console.log("currentAccount: ", currentAccount);

    const checkIfWalletIsConnected = async () => {
        /*
         * ユーザーがMetaMaskを持っているか確認します。
         */
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }
        //接続されているネットワークを確認する。(Rinkbyかどうか)
        let chainId = await ethereum.request({ method: "eth_chainId" });
        const isRinkByChainId = chainId === RINKEBY_CHAIN_ID;
        setRinkebyTestNetwork(isRinkByChainId);
        /*
        // ユーザーが認証可能なウォレットアドレスを持っている場合は、
        // ユーザーに対してウォレットへのアクセス許可を求める。
        // 許可されれば、ユーザーの最初のウォレットアドレスを
        // accounts に格納する。
        */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
            return;
        }
    };

    /*
     * connectWallet メソッドを実装します。
     */
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }
            /*
             * ウォレットアドレスに対してアクセスをリクエストしています。
             */
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected", accounts[0]);
            /*
             * ウォレットアドレスを currentAccount に紐付けます。
             */
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    myEpicNft.abi,
                    signer
                );
                console.log("Going to pop wallet now to pay gas...");
                let nftTxn = await connectedContract.makeAnEpicNFT({
                    value: ethers.utils.parseEther(MINT_PRICE),
                });
                console.log("Mining...please wait.");
                setInProgress(true);
                await nftTxn.wait();
                setInProgress(false);

                console.log(
                    `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
                );
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetLastTokenId = async (connectedContract) => {
        let tokenId = await connectedContract.getLastTokenId();
        if (!tokenId) return;
        setLastTokenId(tokenId.toNumber() - 1);
    }

    useEffect(() => {
        if (!currentChainId) return;
        const isRinkByChainId = currentChainId === RINKEBY_CHAIN_ID;
        setRinkebyTestNetwork(isRinkByChainId);
    }, [currentChainId]);

    useEffect(() => {
        checkIfWalletIsConnected();
        const { ethereum } = window;
        if (!ethereum) return;
        const setChainId = (chainId) => {
            setCurrentChainId(chainId);
        };
        ethereum.on("chainChanged", setChainId);
        return () => ethereum.off("chainChanged", setChainId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const { ethereum } = window;
        if (!ethereum || !currentAccount) return;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            myEpicNft.abi,
            signer
        );
        if (!connectedContract || !isRinkebyTestNetwork) return;
        //接続した時点でのmint数取得
        handleGetLastTokenId(connectedContract);

        //mint 後に emit された NewEpicNFTMinted から値を受け取る
        const handleEmitEvent = (_from, tokenId) => {
            setMyLatestTokenId(tokenId.toNumber());
            handleGetLastTokenId(connectedContract);
        }
        connectedContract.on("NewEpicNFTMinted", handleEmitEvent);
        return () => connectedContract.off("NewEpicNFTMinted", handleEmitEvent);


    }, [currentAccount]);

    return {
        lastTokenId,
        currentAccount,
        isRinkebyTestNetwork,
        inProgress,
        myLatestTokenId,
        connectWallet,
        askContractToMintNft,
    };

}