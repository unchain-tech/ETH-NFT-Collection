# ETH-NFT-Collection (prototype)

![](/packages/client/public/banner-Intro-NFT.png)

## 実行方法

### 1. 本リポジトリのクローン

```bash
git clone git@github.com:unchain-tech/ETH-NFT-Collection.git
```

### 2. パッケージのインストール

```bash
yarn install
```

### 3. コントラクトのデプロイ

#### 3-1. `.env`ファイルを作成

#### 3-2. デプロイの実行

```bash
npx hardhat deploy scripts/deploy.js --network sepolia
```

#### 3-2. ABI ファイルの取得

### 4. 開発サーバーの起動

```bash
yarn client dev
```

ターミナル上に表示された URL にアクセスしましょう。

## 設定

### Git Hooks

```
yarn install
yarn simple-git-hook
```
