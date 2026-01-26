# ROAR - Republik Olahraga

Decentralized Sport Prediction and Fair Distribution Protocol for Base Indonesia Hackathon.

## 🏗️ Project Structure

roar/
├── contracts/ # Solidity smart contracts
│ ├── ROAR.sol # Main prediction protocol contract
│ └── MockIDRX.sol # Mock ERC20 token for testing
├── frontend/ # Next.js frontend application
│ ├── app/ # Next.js app directory
│ ├── components/ # React components
│ └── lib/ # Utilities and configurations
├── scripts/ # Deployment scripts
└── test/ # Contract tests


## 🚀 Features

- **Decentralized Predictions**: Stake IDRX tokens on your favorite athletes
- **Fair Distribution**: Automated fund distribution (60% winners, 20% athlete, 10% club, 5% referee, 5% treasury)
- **Smart Wallet Integration**: Coinbase Smart Wallet support (no seed phrase needed)
- **Base Sepolia Testnet**: Deployed on Base Sepolia for testing

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

## 🔧 Setup

### Smart Contracts

1. Install dependencies:
npm install
