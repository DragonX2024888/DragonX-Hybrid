// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../DragonHybrid.sol";
import "../lib/interfaces/IDragonX.sol";

contract BurnDragonHybridProxy {
    function burn(uint256 id, uint256 burnFee, address dragonHybridAddress, address dragonAddress) external {
        IDragonX dragonX = IDragonX(dragonAddress);
        DragonHybrid dragonHybrid = DragonHybrid(payable(dragonHybridAddress));

        // Approve DragonX Hybrid to spent the burn fee
        dragonX.approve(dragonHybridAddress, burnFee);

        // Burn the NFT
        dragonHybrid.burn(id);
    }
}
