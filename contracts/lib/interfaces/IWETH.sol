// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWETH9 is IERC20 {
    // Deposit ether to get wrapped ether
    function deposit() external payable;

    // Withdraw wrapped ether to get ether
    function withdraw(uint256) external;
}
