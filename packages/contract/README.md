# Contract

## 構成

```bash
contracts/
├── libraries
│    └── Base64.sol
└── MyEpicNFT.sol
```

### `libraries/Base64.sol`

SVG と JSON を Base64 に変換するための関数が含まれています。このファイルは、`MyEpicNFT`コントラクトがインポートしています。

### `MyEpicNFT.sol`

NFT を発行するコントラクトです。

## 自動テスト

`test`ディレクトリに`MyEpicNFT`コントラクトの機能をテストするファイルが格納されています。

### 実行方法

```bash
npx hardhat test
```

期待される出力

```bash
MyEpicNFT
    pickRandomFirstWord
This is my NFT contract.
rand - seed:  96777463446932378109744360884080025980584389114515208476196941633474201541706
rand - first word:  0
      ✔ should get strings in firstWords (890ms)
    pickRandomSecondWord
      ✔ should get strings in secondWords
    pickRandomThirdWord
      ✔ should get strings in thirdWords
    makeAnEpicNFT
rand - seed:  96777463446932378109744360884080025980584389114515208476196941633474201541706
rand - first word:  0

----- SVG data -----
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>EpicPopBird</text></svg>
--------------------


----- Token URI ----
data:application/json;base64,eyJuYW1lIjogIkVwaWNQb3BCaXJkIiwgImRlc2NyaXB0aW9uIjogIkEgaGlnaGx5IGFjY2xhaW1lZCBjb2xsZWN0aW9uIG9mIHNxdWFyZXMuIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owbmFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jbklIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlKM2hOYVc1WlRXbHVJRzFsWlhRbklIWnBaWGRDYjNnOUp6QWdNQ0F6TlRBZ016VXdKejQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklESTBjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTY3hNREFsSnlCb1pXbG5hSFE5SnpFd01DVW5JR1pwYkd3OUoySnNZV05ySnlBdlBqeDBaWGgwSUhnOUp6VXdKU2NnZVQwbk5UQWxKeUJqYkdGemN6MG5ZbUZ6WlNjZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUoyMXBaR1JzWlNjZ2RHVjRkQzFoYm1Ob2IzSTlKMjFwWkdSc1pTYytSWEJwWTFCdmNFSnBjbVE4TDNSbGVIUStQQzl6ZG1jKyJ9
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      ✔ emit a NewEpicNFTMinted event (74ms)


  4 passing (985ms)
```
