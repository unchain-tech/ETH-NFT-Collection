const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('MyEpicNFT', function () {
  // 各テストの前に呼び出す関数です。テストで使用する変数やコントラクトのデプロイを行います。
  async function deployMyEpicNFTFixture() {
    // テストアカウントを取得します。
    const [owner] = await ethers.getSigners();

    // コントラクト内で使用する単語の配列を定義します。
    const firstWords = [
      'Epic',
      'Fantastic',
      'Crude',
      'Crazy',
      'Hysterical',
      'Grand',
    ];
    const secondWords = ['Meta', 'Live', 'Pop', 'Cute', 'Sweet', 'Hot'];
    const thirdWords = [
      'Kitten',
      'Puppy',
      'Monkey',
      'Bird',
      'Panda',
      'Elephant',
    ];

    // コントラクトのインスタンスを生成し、デプロイを行います。
    const MyEpicNFTFactory = await ethers.getContractFactory('MyEpicNFT');
    const MyEpicNFT = await MyEpicNFTFactory.deploy();

    return { MyEpicNFT, owner, firstWords, secondWords, thirdWords };
  }

  describe('pickRandomFirstWord', function () {
    it('should get strings in firstWords', async function () {
      // テストの準備をします。
      const { MyEpicNFT, firstWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      // 実行＆確認をします。
      expect(firstWords).to.include(await MyEpicNFT.pickRandomFirstWord(0));
    });
  });

  describe('pickRandomSecondWord', function () {
    it('should get strings in secondWords', async function () {
      const { MyEpicNFT, secondWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      expect(secondWords).to.include(await MyEpicNFT.pickRandomSecondWord(0));
    });
  });

  describe('pickRandomThirdWord', function () {
    it('should get strings in thirdWords', async function () {
      const { MyEpicNFT, thirdWords } = await loadFixture(
        deployMyEpicNFTFixture,
      );

      expect(thirdWords).to.include(await MyEpicNFT.pickRandomThirdWord(0));
    });
  });

  describe('makeAnEpicNFT', function () {
    it('emit a NewEpicNFTMinted event', async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);

      // 発行されるイベントの確認をします。
      await expect(MyEpicNFT.makeAnEpicNFT())
        .to.emit(MyEpicNFT, 'NewEpicNFTMinted')
        .withArgs(owner.address, 0);
    });
  });
});
