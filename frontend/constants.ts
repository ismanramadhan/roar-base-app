// Contract addresses - Update these after deployment
export const ROAR_CONTRACT_ADDRESS = "0xa8f5b5ddc67c5e5a2Fa53D9740eEA6EfDc1bAAB2"; // Update after deployment
export const MOCK_IDRX_ADDRESS = "0x2B31Fc4AD4B928b56ca81eCD597e9676F390fF9E"; // Update after deployment

// Base Sepolia Chain ID
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// ROAR Contract ABI
export const ROAR_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_idrxToken", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "matchId", type: "uint256" },
      { indexed: true, internalType: "address", name: "backer", type: "address" },
      { indexed: false, internalType: "uint8", name: "side", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "AthleteBacked",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "matchId", type: "uint256" },
      { internalType: "uint8", name: "side", type: "uint8" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "backAthlete",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_athleteA", type: "string" },
      { internalType: "string", name: "_athleteB", type: "string" },
      { internalType: "address", name: "_clubAddress", type: "address" },
      { internalType: "address", name: "_refereeAddress", type: "address" },
    ],
    name: "createMatch",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "matchId", type: "uint256" }],
    name: "distributeFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "matchId", type: "uint256" }, { internalType: "uint8", name: "side", type: "uint8" }],
    name: "getBackingAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "matchId", type: "uint256" },
      { internalType: "address", name: "backer", type: "address" },
      { internalType: "uint8", name: "side", type: "uint8" },
    ],
    name: "getBackerStake",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "matchId", type: "uint256" }],
    name: "getMatch",
    outputs: [
      { internalType: "string", name: "athleteA", type: "string" },
      { internalType: "string", name: "athleteB", type: "string" },
      { internalType: "address", name: "clubAddress", type: "address" },
      { internalType: "address", name: "refereeAddress", type: "address" },
      { internalType: "uint256", name: "totalPool", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint8", name: "winner", type: "uint8" },
      { internalType: "uint256", name: "challengeDeadline", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "idrxToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "matches",
    outputs: [
      { internalType: "string", name: "athleteA", type: "string" },
      { internalType: "string", name: "athleteB", type: "string" },
      { internalType: "address", name: "clubAddress", type: "address" },
      { internalType: "address", name: "refereeAddress", type: "address" },
      { internalType: "uint256", name: "totalPool", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint8", name: "winner", type: "uint8" },
      { internalType: "uint256", name: "challengeDeadline", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "matchCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_treasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "matchId", type: "uint256" },
      { internalType: "uint8", name: "winner", type: "uint8" },
    ],
    name: "submitResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 ABI for MockIDRX
export const ERC20_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;