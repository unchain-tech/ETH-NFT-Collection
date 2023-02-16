import "./styles/App.css";

// フロントエンドとコントラクトを連携するライブラリをインポートします。
import { ethers } from "ethers";
// useEffect と useState 関数を React.js からインポートしています。
import React, { useEffect, useState } from "react";

import twitterLogo from "./assets/twitter-logo.svg";
import myEpicNft from "./utils/MyEpicNFT.json";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = 'desmo_nft';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/assets';
const TOTAL_MINT_COUNT = 50;

// コントラクトアドレスをCONTRACT_ADDRESS変数に格納
const CONTRACT_ADDRESS = "0xe709a08C63e6EdabA32fF3dE480A339A0a5Cd2aB";

const App = () => {
  // ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");
  // ミント済み数を格納する状態変数
  const [totalSupply, setTotalSupply] = useState("");
  // ミント中フラグ
  const [isMinting, setIsMinting] = useState("");
  // 完売フラグ
  const [soldOut, setSoldOut] = useState("");

  // setupEventListener 関数を定義します。
  // MyEpicNFT.sol の中で event が　emit された時に、
  // 情報を受け取ります。
  const setupEventListener = async () => {
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

        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: ${OPENSEA_LINK}/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      } 
    } catch (error) {
      console.log(error);
    }
  };

  // ユーザーが認証可能なウォレットアドレスを持っているか確認します。
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    // Goerliに接続しているか確認
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);
    const goerliChainId = "0x5";
    // 接続していない場合は、メタマスクの切り替え画面を出す
    if (chainId !== goerliChainId) {
      alert("Please switch connection to Goerli Test Network!");

      await ethereum.request({ 
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }

		// ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを accounts に格納する。
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // イベントリスナーを設定
      // この時点で、ユーザーはウォレット接続が済んでいます。      
      setupEventListener();
      // ミント済み数を取得
      getTotalSupply();
    } else {
      console.log("No authorized account found");
    }
  };

  // connectWallet メソッドを実装します。
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Goerliに接続しているか確認
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      const goerliChainId = "0x5";
      // 接続していない場合は、メタマスクの切り替え画面を出す
      if (chainId !== goerliChainId) {
        alert("Please switch connection to Goerli Test Network!");

        await ethereum.request({ 
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
      }

      // ウォレットアドレスに対してアクセスをリクエストしています。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);

      // ウォレットアドレスを currentAccount に紐付けます。
      setCurrentAccount(accounts[0]);

      // イベントリスナーを設定
      setupEventListener();
      // ミント済み数を取得
      getTotalSupply();
    } catch (error) {
      console.log(error);
    }
  };

  // NFT を Mint する関数を定義しています。
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
        let nftTxn = await connectedContract.makeAnEpicNFT();

        setIsMinting(true)
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
        setIsMinting(false)

        // ミント済み数を更新
        getTotalSupply();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ミント済み数を取得する関数
  const getTotalSupply = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          provider
        );

        let totalSupply = await connectedContract.totalSupply();
        setTotalSupply(totalSupply);
        console.log("Got totalSupply");

        if (totalSupply == TOTAL_MINT_COUNT) {
          setSoldOut(true)
        }

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  // ページがロードされた際に下記が実行されます。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // renderNotConnectedContainer メソッド（ Connect to Wallet を表示する関数）を定義します。
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  // Mint NFT ボタンをレンダリングするメソッドを定義します。
  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button mint-button"
    >
      Mint NFT
    </button>
  );

  // Mint NFT ボタンをレンダリングするメソッドを定義します。
  const renderMintingUI = () => (
    <button
      onClick={null}
      className="cta-button minting-button"
    >
      Minting ...
    </button>
  );

  // Mint NFT ボタンをレンダリングするメソッドを定義します。
  const renderSoldOutUI = () => (
    <button
      onClick={null}
      className="cta-button soldout-button"
    >
      SOLD OUT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          <p className="mint-count">現在のミント済み数 {`${totalSupply} / ${TOTAL_MINT_COUNT}`}</p>
          {/*条件付きレンダリング。
          // すでにウォレット接続されている場合は、
          // Mint NFT か Minting...を表示する。*/}
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : soldOut
                ? renderSoldOutUI()
                : isMinting
                  ? renderMintingUI()
                  : renderMintUI()
          }
        </div>
        <div className="middle-container">
          <button className="opensea-button">
            <a
              className="opensea-text"
              href="https://testnets.opensea.io/collection/squarenft-80"
              target="_blank"
              rel="noreferrer"
            >
              OpenSeaでコレクションを表示
            </a>
          </button>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;