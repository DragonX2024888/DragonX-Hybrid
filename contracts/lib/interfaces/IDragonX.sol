// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDragonX is IERC20 {
    // External functions
    function mint(uint256 amount) external;
    function stake() external;
    function claim() external returns (uint256 claimedAmount);
    function totalStakesOpened() external view returns (uint256 totalStakes);
    function incentiveFeeForClaim() external view returns (uint256 fee);
    function stakeReachedMaturity() external view returns (bool hasStakesToEnd, address instanceAddress, uint256 sId);
    function burn() external;
    function vault() external view returns (uint256 vault);

    // Public functions
    function updateVault() external;
    function totalEthClaimable() external view returns (uint256 claimable);
}
