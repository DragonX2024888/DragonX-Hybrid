// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// OpenZeppelin
import "@openzeppelin/contracts/utils/Context.sol";

// lib
import "./lib/interfaces/IDragonX.sol";
import "./lib/Constants.sol";

contract DragonBurnProxy is Context {
    // -----------------------------------------
    // Type declarations
    // -----------------------------------------

    // -----------------------------------------
    // State variables
    // -----------------------------------------
    /**
     * @notice The total amount of DragonX burned through the DragonX burn proxy
     */
    uint256 public totalDragonBurned;

    // -----------------------------------------
    // Events
    // -----------------------------------------
    /**
     * Emitted when burning all DragonX tokens hold by the DragonX burn proxy
     * @param caller the function caller
     * @param amount the amount burned
     */
    event Burned(address indexed caller, uint256 indexed amount);

    // -----------------------------------------
    // Errors
    // -----------------------------------------

    // -----------------------------------------
    // Modifiers
    // -----------------------------------------

    // -----------------------------------------
    // Constructor
    // -----------------------------------------

    // -----------------------------------------
    // Receive function
    // -----------------------------------------
    /**
     * @dev Receive function to handle plain Ether transfers.
     * Always revert.
     */
    receive() external payable {
        revert("noop");
    }

    // -----------------------------------------
    // Fallback function
    // -----------------------------------------
    /**
     * @dev Fallback function to handle non-function calls or Ether transfers if receive() doesn't exist.
     * Always revert.
     */
    fallback() external {
        revert("noop");
    }

    // -----------------------------------------
    // External functions
    // -----------------------------------------
    /**
     * @dev Burns tokens held by this contract and updates the total burned tokens count.
     *      Only callable by external addresses.
     *
     *      The function retrieves the balance of tokens (assumed to be DragonX tokens)
     *      held by the contract itself. If the balance is non-zero, it proceeds to burn
     *      those tokens by calling the `burn` method on the DragonX contract. After burning
     *      the tokens, it updates the `totalDragonBurned` state variable to reflect the new
     *      total amount of burned tokens. Finally, it emits a `Burned` event indicating
     *      the address that initiated the burn and the amount of tokens burned.
     *
     * Emits a `Burned` event with the caller's address and the amount burned.
     */
    function burn() external {
        IDragonX dragonX = IDragonX(DRAGONX_ADDRESS);
        uint256 toBurn = dragonX.balanceOf(address(this));

        // noop if nothing to burn
        if (toBurn == 0) {
            return;
        }

        // Burn tokens hold by the proxy
        dragonX.burn();

        // Update State
        totalDragonBurned += toBurn;

        // Emit events
        emit Burned(_msgSender(), toBurn);
    }

    // -----------------------------------------
    // Public functions
    // -----------------------------------------

    // -----------------------------------------
    // Internal functions
    // -----------------------------------------

    // -----------------------------------------
    // Private functions
    // -----------------------------------------
}
