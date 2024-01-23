// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// Addresses
address constant DRAGONX_ADDRESS = 0x96a5399D07896f757Bd4c6eF56461F58DB951862;
address constant TITANX_ADDRESS = 0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1;
address constant WETH9_ADDRESS = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
address constant UNI_SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

/* Uniswap Liquidity Pools (DragonX, TitanX) */
uint24 constant FEE_TIER = 10000;

// Dragon Types
enum DragonTypes {
    // 8 Million DragonX lock up, mint fee: 800 K TitanX, burn fee: 80 K DragonX
    Apprentice,
    // 88 Million DragonX lock up, mint fee: 8 Million TitanX, burn fee: 800 K DragonX
    Ninja,
    // 888 Million DragonX, mint fee: 88 Million TitanX, burn fee: 8 Million DragonX
    Samurai,
    // 8 Billion DragonX, mint fee: 888 Million TitanX, burn fee: 88 Million DragonX
    Shogun,
    // 88 Billion DragonX, mint fee: 8 Billion TitanX, burn fee: 888 Million DragonX
    Emperor
}

// Constants for Apprentice
uint256 constant APPRENTICE_MINT_FEE = 800000 * 10 ** 18; // 800 K TitanX with 18 decimals
uint256 constant APPRENTICE_BURN_FEE = 80000 * 10 ** 18; // 80 K DragonX with 18 decimals
uint256 constant APPRENTICE_LOCKUP_AMOUNT = 8000000 * 10 ** 18; // 8 Million DragonX with 18 decimals

// Constants for Ninja
uint256 constant NINJA_MINT_FEE = 8000000 * 10 ** 18; // 8 Million TitanX with 18 decimals
uint256 constant NINJA_BURN_FEE = 800000 * 10 ** 18; // 800 K DragonX with 18 decimals
uint256 constant NINJA_LOCKUP_AMOUNT = 88000000 * 10 ** 18; // 88 Million DragonX with 18 decimals

// Constants for Samurai
uint256 constant SAMURAI_MINT_FEE = 88000000 * 10 ** 18; // 88 Million TitanX with 18 decimals
uint256 constant SAMURAI_BURN_FEE = 8000000 * 10 ** 18; // 8 Million DragonX with 18 decimals
uint256 constant SAMURAI_LOCKUP_AMOUNT = 888000000 * 10 ** 18; // 888 Million DragonX with 18 decimals

// Constants for Shogun
uint256 constant SHOGUN_MINT_FEE = 888000000 * 10 ** 18; // 888 Million TitanX with 18 decimals
uint256 constant SHOGUN_BURN_FEE = 88000000 * 10 ** 18; // 88 Million DragonX with 18 decimals
uint256 constant SHOGUN_LOCKUP_AMOUNT = 8000000000 * 10 ** 18; // 8 Billion DragonX with 18 decimals

// Constants for Emperor
uint256 constant EMPEROR_MINT_FEE = 8000000000 * 10 ** 18; // 8 Billion TitanX with 18 decimals
uint256 constant EMPEROR_BURN_FEE = 888000000 * 10 ** 18; // 888 Million DragonX with 18 decimals
uint256 constant EMPEROR_LOCKUP_AMOUNT = 88000000000 * 10 ** 18; // 88 Billion DragonX with 18 decimals
