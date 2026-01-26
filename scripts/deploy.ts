import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Get current nonce
  const currentNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("Current nonce:", currentNonce);

  // Check if MockIDRX should be deployed (can skip if already deployed)
  const deployMockIDRX = process.env.DEPLOY_MOCK_IDRX !== "false";
  let mockIDRXAddress = process.env.MOCK_IDRX_ADDRESS;

  if (deployMockIDRX && !mockIDRXAddress) {
    // Deploy MockIDRX
    console.log("\nDeploying MockIDRX...");
    const MockIDRX = await ethers.getContractFactory("MockIDRX");
    const mockIDRX = await MockIDRX.deploy();
    
    // Wait for deployment with confirmations
    console.log("Waiting for MockIDRX deployment confirmation...");
    await mockIDRX.waitForDeployment();
    
    mockIDRXAddress = await mockIDRX.getAddress();
    console.log("MockIDRX deployed to:", mockIDRXAddress);
    
    // Wait a bit to ensure transaction is processed
    await new Promise(resolve => setTimeout(resolve, 2000));
  } else if (mockIDRXAddress) {
    console.log("\nUsing existing MockIDRX at:", mockIDRXAddress);
  } else {
    throw new Error("MockIDRX address is required. Set MOCK_IDRX_ADDRESS in .env or deploy it first.");
  }

  // Deploy ROAR
  // Using deployer address as treasury for initial deployment
  console.log("\nDeploying ROAR...");
  const ROAR = await ethers.getContractFactory("ROAR");
  
  // Get nonce again before deploying ROAR
  const nonceBeforeROAR = await ethers.provider.getTransactionCount(deployer.address);
  console.log("Nonce before ROAR deployment:", nonceBeforeROAR);
  
  const roar = await ROAR.deploy(mockIDRXAddress, deployer.address);
  
  console.log("Waiting for ROAR deployment confirmation...");
  await roar.waitForDeployment();
  
  const roarAddress = await roar.getAddress();
  console.log("ROAR deployed to:", roarAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("MockIDRX Address:", mockIDRXAddress);
  console.log("ROAR Address:", roarAddress);
  console.log("Treasury Address:", deployer.address);
  console.log("\nDeployment completed successfully!");
  
  console.log("\n=== Next Steps ===");
  console.log("Update your frontend/constants.ts with these addresses:");
  console.log(`ROAR_CONTRACT_ADDRESS = "${roarAddress}"`);
  console.log(`MOCK_IDRX_ADDRESS = "${mockIDRXAddress}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    
    if (error.message?.includes("nonce")) {
      console.error("\n💡 Nonce error detected. Try:");
      console.error("1. Wait a few minutes for pending transactions to clear");
      console.error("2. Or deploy ROAR separately by setting MOCK_IDRX_ADDRESS in .env");
      console.error("3. Check your account on BaseScan: https://sepolia.basescan.org/address/YOUR_ADDRESS");
    }
    
    process.exit(1);
  });