export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const DRAGONX_ADDRESS = '0x96a5399D07896f757Bd4c6eF56461F58DB951862'
export const TITANX_ADDRESS = '0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1'

// Dragon Types
export enum DragonTypes {
  // 8 Million DragonX lock up, mint fee: 800 K TitanX, burn fee: 80 K DragonX
  Apprentice,
  // 88 Million DragonX lock up, mint fee: 8 Million TitanX, burn fee: 800 K DragonX
  Ninja,
  // 888 Million DragonX, mint fee: 88 Million TitanX, burn fee: 8 Million DragonX
  Samurai,
  // 8 Billion DragonX, mint fee: 888 Million TitanX, burn fee: 88 Million DragonX
  Shogun,
  // 88 Billion DragonX, mint fee: 8 Billion TitanX, burn fee: 888 Million DragonX
  Emperor,

  Invalid
}

export function toDragonTypeEnum(value: bigint): DragonTypes {
  const key = Number(value)
  if (Object.values(DragonTypes).includes(key)) {
    return key as DragonTypes
  }
  throw Error('Invalid Value for Enum Mapping')
}

// Constants for Apprentice
export const APPRENTICE_MINT_FEE = 8800n * 10n ** 18n // 8.8 K TitanX with 18 decimals
export const APPRENTICE_BURN_FEE = 8800n * 10n ** 18n // 8.8 K DragonX with 18 decimals
export const APPRENTICE_LOCKUP_AMOUNT = 8800000n * 10n ** 18n // 8.8 Million DragonX with 18 decimals

// Constants for Ninja
export const NINJA_MINT_FEE = 88000n * 10n ** 18n // 88 K TitanX with 18 decimals
export const NINJA_BURN_FEE = 88000n * 10n ** 18n // 88 K DragonX with 18 decimals
export const NINJA_LOCKUP_AMOUNT = 88000000n * 10n ** 18n // 88 Million DragonX with 18 decimals

// Constants for Samurai
export const SAMURAI_MINT_FEE = 880000n * 10n ** 18n // 880 K TitanX with 18 decimals
export const SAMURAI_BURN_FEE = 880000n * 10n ** 18n // 880 K DragonX with 18 decimals
export const SAMURAI_LOCKUP_AMOUNT = 888000000n * 10n ** 18n // 888 Million DragonX with 18 decimals

// Constants for Shogun
export const SHOGUN_MINT_FEE = 8800000n * 10n ** 18n // 8.8 Million TitanX with 18 decimals
export const SHOGUN_BURN_FEE = 8800000n * 10n ** 18n // 8.8 Million DragonX with 18 decimals
export const SHOGUN_LOCKUP_AMOUNT = 8800000000n * 10n ** 18n // 8.8 Billion DragonX with 18 decimals

// Constants for Emperor
export const EMPEROR_MINT_FEE = 88800000n * 10n ** 18n // 88.8 Million TitanX with 18 decimals
export const EMPEROR_BURN_FEE = 88800000n * 10n ** 18n // 88.8 Million DragonX with 18 decimals
export const EMPEROR_LOCKUP_AMOUNT = 88000000000n * 10n ** 18n // 88 Billion DragonX with 18 decimals
