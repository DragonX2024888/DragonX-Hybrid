// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// lib
import "./lib/Constants.sol";
import "./lib/interfaces/IDragonX.sol";
import "./DragonBurnProxy.sol";

/*
 * @title The DragonX Hybrid Contranct
 * @author The DragonX devs
 */
contract DragonHybrid is ERC721Enumerable, Ownable2Step {
    using SafeERC20 for IERC20;
    using SafeERC20 for IDragonX;
    using Strings for uint256;

    // -----------------------------------------
    // Type declarations
    // -----------------------------------------
    /**
     * @notice Detailed Ownership Info
     */
    struct DragonOwnerDetails {
        uint256[] tokenIds;
        uint256 balanceOf;
    }

    /**
     * @notice Owner Info Query
     */
    struct DragonOwnerInfo {
        DragonOwnerDetails Apprentice;
        DragonOwnerDetails Ninja;
        DragonOwnerDetails Samurai;
        DragonOwnerDetails Shogun;
        DragonOwnerDetails Emperor;
    }

    // -----------------------------------------
    // State variables
    // -----------------------------------------
    /**
     * @notice maps NFT id to its metadata
     */
    mapping(uint256 => DragonTypes) public tokenIdToDragonType;

    /**
     * @notice the current total supply der individual dragon type
     */
    mapping(DragonTypes dragonType => uint256 totalSupply)
        public totalSupplyPerDragon;

    /**
     * @notice balance of dragons per owner
     */
    mapping(address owner => mapping(DragonTypes dragonType => uint256 balanceOf))
        public balanceOfDragon;

    /**
     * @notice The total amount of TitanX collected and send to the
     * the DragonX vault for minting NFTs
     */
    uint256 public totalMintFee;

    /**
     * @notice The total amount of DragonX locked to burn NFTs
     */
    uint256 public totalBurnFee;

    /**
     * @notice The DragonX vault representing the tockens locked in the bridge
     */
    uint256 public vault;

    /**
     * @dev the next token ID for minting
     */
    uint256 private _nextTokenId = 1;

    /**
     * @dev the base URI for DragonX Hybrid
     */
    string private _baseTokenURI;

    /**
     * @dev the burn proxy contract for the burn fee
     */
    address private _burnProxyAddress;

    // -----------------------------------------
    // Events
    // -----------------------------------------
    /**
     * Emitted when a NFT is minted
     * @param to the new owner
     * @param tokenId the token ID (NFT ID)
     * @param dragonType the dragon type
     * @param lockupAmount the amount locked in the bridge contract
     * @param fee the fee paid for minting (in liquid TitanX)
     */
    event Minted(
        address indexed to,
        uint256 indexed tokenId,
        DragonTypes dragonType,
        uint256 lockupAmount,
        uint256 fee
    );

    /**
     * Emitted when a NFT is burned
     * @param from the owner of the NFT
     * @param tokenId the token ID (NFT ID)
     * @param dragonType the dragon type
     * @param releasedAmount the released amount (released from bridge vault)
     * @param fee the fee payed to burn the token (in liquid DragonX)
     */
    event Burned(
        address indexed from,
        uint256 indexed tokenId,
        DragonTypes dragonType,
        uint256 releasedAmount,
        uint256 fee
    );

    // -----------------------------------------
    // Errors
    // -----------------------------------------

    // -----------------------------------------
    // Modifiers
    // -----------------------------------------

    // -----------------------------------------
    // Constructor
    // -----------------------------------------
    /**
     * @dev Initializes a new instance of a contract that inherits from ERC721 and Ownable.
     *      This constructor sets up a new DragonX Hybrid NFT contract with a specified base URI
     *      for token metadata and a burn proxy address.
     *
     * @param baseTokenURI The base URI for token metadata. Must be a non-empty string.
     * @param burnProxy The address of the burn proxy. Must not be the zero address.
     */
    constructor(
        string memory baseTokenURI,
        address burnProxy
    ) ERC721("DragonX Hybrid", "DRAGONXHYBRID") Ownable(msg.sender) {
        require(burnProxy != address(0), "invalid burn proxy");
        require(bytes(baseTokenURI).length > 0, "invalid base URI");

        _baseTokenURI = baseTokenURI;
        _burnProxyAddress = burnProxy;
    }

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
     * @dev Mints a new token of a specified dragon type.
     *
     * This function first determines the lock amount and mint fee for the specified
     * dragon type by calling `getDragonDetails`. It transfers the required amount of
     * DragonX tokens from the caller to the contract, updating the `vault`.
     * The TitanX mint fee is transferred from the caller to the DragonX vault, after which
     * the vault's balance is updated.
     * A new token ID is generated, and a new NFT is minted for the caller. The function
     * updates the total mint fee collected, maps the new token ID to its dragon type,
     * and increments the `_nextTokenId`.
     * Finally, the function emits a `Minted` event, detailing the minting transaction.
     *
     * @param dragonType The type of dragon to mint, as defined in the `DragonTypes` enum.
     * @return newTokenId The ID of the newly minted token.
     */

    function mint(
        DragonTypes dragonType
    ) external returns (uint256 newTokenId) {
        IDragonX dragonX = IDragonX(DRAGONX_ADDRESS);
        IERC20 titanX = IERC20(TITANX_ADDRESS);

        // Determine lock amount and mint fee based on the dragon type
        (uint256 mintFee, , uint256 lockAmount) = getDragonDetails(dragonType);

        // Transfer and lock DragonX in the NFT bridge
        dragonX.safeTransferFrom(_msgSender(), address(this), lockAmount);
        vault += lockAmount;

        // Transfer TitanX mint fee to the DragonX vault and update the vault
        titanX.safeTransferFrom(_msgSender(), DRAGONX_ADDRESS, mintFee);
        dragonX.updateVault();

        // Mint a new NFT
        newTokenId = _nextTokenId;
        _mint(_msgSender(), newTokenId);

        // Update state
        totalMintFee += mintFee;
        tokenIdToDragonType[newTokenId] = dragonType;
        totalSupplyPerDragon[dragonType] += 1;
        balanceOfDragon[_msgSender()][dragonType] += 1;
        _nextTokenId++;

        // Emit event
        emit Minted(_msgSender(), newTokenId, dragonType, lockAmount, mintFee);
    }

    /**
     * @dev Burns a specific token (represented by `tokenId`) and handles associated fees and locked amounts.
     *
     *      The burn fee is transferred from the caller's address to the burn proxy address, and then
     *      the `burn` method is called on the burn proxy. The locked amount of tokens is released back
     *      to the NFT owner, and the `vault` state variable is decreased by the lock amount.
     *      Finally, the function emits a `Burned` event with details of the burn transaction.
     *
     * @param tokenId The ID of the token to be burned.
     */
    function burn(uint256 tokenId) external {
        IDragonX dragonX = IDragonX(DRAGONX_ADDRESS);
        DragonBurnProxy burnProxy = DragonBurnProxy(payable(_burnProxyAddress));
        DragonTypes dragonType = tokenIdToDragonType[tokenId];

        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        address from = _update(address(0), tokenId, _msgSender());

        // Determine locked amount and burn fee based on the dragon type
        (, uint256 burnFee, uint256 lockAmount) = getDragonDetails(dragonType);

        // Send burn fee to burn proxy
        dragonX.safeTransferFrom(_msgSender(), _burnProxyAddress, burnFee);
        burnProxy.burn();

        // Update state
        totalBurnFee += burnFee;
        totalSupplyPerDragon[dragonType] -= 1;
        balanceOfDragon[from][dragonType] -= 1;

        // Release tokens to NFT owner
        dragonX.safeTransfer(_msgSender(), lockAmount);
        vault -= lockAmount;

        // Emit event
        emit Burned(from, tokenId, dragonType, lockAmount, burnFee);
    }

    /**
     * @notice Retrieves detailed dragon ownership information for a given owner.
     * @param owner The address whose dragon ownership information is being queried.
     * @return ownerInfo A DragonOwnerInfo struct containing detailed information about the dragons owned.
     */
    function dragonsOfOwner(
        address owner
    ) external view returns (DragonOwnerInfo memory ownerInfo) {
        // Initialize the balances
        ownerInfo.Apprentice.balanceOf = balanceOfDragon[owner][
            DragonTypes.Apprentice
        ];
        ownerInfo.Ninja.balanceOf = balanceOfDragon[owner][DragonTypes.Ninja];
        ownerInfo.Samurai.balanceOf = balanceOfDragon[owner][
            DragonTypes.Samurai
        ];
        ownerInfo.Shogun.balanceOf = balanceOfDragon[owner][DragonTypes.Shogun];
        ownerInfo.Emperor.balanceOf = balanceOfDragon[owner][
            DragonTypes.Emperor
        ];

        // Initialize the tokenIds arrays with the correct sizes
        ownerInfo.Apprentice.tokenIds = new uint256[](
            ownerInfo.Apprentice.balanceOf
        );
        ownerInfo.Ninja.tokenIds = new uint256[](ownerInfo.Ninja.balanceOf);
        ownerInfo.Samurai.tokenIds = new uint256[](ownerInfo.Samurai.balanceOf);
        ownerInfo.Shogun.tokenIds = new uint256[](ownerInfo.Shogun.balanceOf);
        ownerInfo.Emperor.tokenIds = new uint256[](ownerInfo.Emperor.balanceOf);

        uint256 ownerBalance = balanceOf(owner);
        uint256[] memory counters = new uint256[](5);

        // Loop to populate the tokenIds
        for (uint256 idx = 0; idx < ownerBalance; idx++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, idx);
            DragonTypes dragonType = tokenIdToDragonType[tokenId];

            if (dragonType == DragonTypes.Apprentice) {
                ownerInfo.Apprentice.tokenIds[counters[0]++] = tokenId;
            }
            if (dragonType == DragonTypes.Ninja) {
                ownerInfo.Ninja.tokenIds[counters[1]++] = tokenId;
            }
            if (dragonType == DragonTypes.Samurai) {
                ownerInfo.Samurai.tokenIds[counters[2]++] = tokenId;
            }
            if (dragonType == DragonTypes.Shogun) {
                ownerInfo.Shogun.tokenIds[counters[3]++] = tokenId;
            }
            if (dragonType == DragonTypes.Emperor) {
                ownerInfo.Emperor.tokenIds[counters[4]++] = tokenId;
            }
        }

        return ownerInfo;
    }

    /**
     * @dev Sets the base URI for token metadata. This function can only be called by genesis (contract owner).
     * @param baseTokenURI The base URI to be set for the token metadata. Must be a non-empty string.
     */
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        require(bytes(baseTokenURI).length > 0, "invalid base URI");
        _baseTokenURI = baseTokenURI;
    }

    // -----------------------------------------
    // Public functions
    // -----------------------------------------
    /**
     * @dev Returns the URI for a given token ID. This URI points to the token's metadata.
     *
     *      The URI is constructed by concatenating the base URI with the string representation
     *      of the `dragonType` associated with the `tokenId`. This URI points to
     *      a JSON file hosted externally that includes metadata such as the token's name,
     *      description, and attributes.
     *
     * @param tokenId The unique identifier for a token.
     * @return A string representing the URI of the given token ID.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        DragonTypes dragonType = tokenIdToDragonType[tokenId];

        string memory baseURI = _baseURI();
        return
            string(abi.encodePacked(baseURI, uint256(dragonType).toString()));
    }

    /**
     * @dev Returns the details for a given dragon type, including mint fee, burn fee, and lock amount.
     *
     * @param dragonType The type of the dragon as defined in the `DragonTypes` enum.
     * @return mintFee The fee required to mint a dragon of the specified type.
     * @return burnFee The fee required to burn a dragon of the specified type.
     * @return lockAmount The amount that needs to be locked up for a dragon of the specified type.
     */
    function getDragonDetails(
        DragonTypes dragonType
    )
        public
        pure
        returns (uint256 mintFee, uint256 burnFee, uint256 lockAmount)
    {
        if (dragonType == DragonTypes.Apprentice) {
            burnFee = APPRENTICE_BURN_FEE;
            mintFee = APPRENTICE_MINT_FEE;
            lockAmount = APPRENTICE_LOCKUP_AMOUNT;
        }
        if (dragonType == DragonTypes.Ninja) {
            burnFee = NINJA_BURN_FEE;
            mintFee = NINJA_MINT_FEE;
            lockAmount = NINJA_LOCKUP_AMOUNT;
        }
        if (dragonType == DragonTypes.Samurai) {
            burnFee = SAMURAI_BURN_FEE;
            mintFee = SAMURAI_MINT_FEE;
            lockAmount = SAMURAI_LOCKUP_AMOUNT;
        }
        if (dragonType == DragonTypes.Shogun) {
            burnFee = SHOGUN_BURN_FEE;
            mintFee = SHOGUN_MINT_FEE;
            lockAmount = SHOGUN_LOCKUP_AMOUNT;
        }
        if (dragonType == DragonTypes.Emperor) {
            burnFee = EMPEROR_BURN_FEE;
            mintFee = EMPEROR_MINT_FEE;
            lockAmount = EMPEROR_LOCKUP_AMOUNT;
        }
    }

    // -----------------------------------------
    // Internal functions
    // -----------------------------------------
    /**
     * @dev get the base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // -----------------------------------------
    // Private functions
    // -----------------------------------------
}
