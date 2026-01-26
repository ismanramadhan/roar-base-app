// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockIDRX is ERC20 {
    constructor() ERC20("Mock IDRX", "mIDRX") {
        // Mint 1,000,000 tokens to the deployer for testing
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    // Function to mint tokens for testing purposes
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}