# CollectionController Contract

This smart contract implements a collection controller for creating and managing NFT collections. It features functionalities for creating collections, setting collection metadata, and minting NFTs for collections.

## Contract Dependencies

The contract depends on the following OpenZeppelin contracts:

-   IERC20Upgradeable
-   SafeERC20Upgradeable
-   OwnableUpgradeable
-   Initializable
-   EnumerableSetUpgradeable
-   ReentrancyGuardUpgradeable

## Contract Variables

The contract maintains several state variables:

-   `feeTo`: Address to receive revenue
-   `verifier`: Address to verify signature
-   `totalCollection`: Total number of collections created in the contract
-   `collections`: Mapping of collection index to collection details
-   `layerHashes`: Mapping of minted layer id hash
-   `artistToCollection`: Mapping of owner address to the set of collections they own

## Contract Events

The contract includes several events to provide information about important contract state changes:

-   `FeeToAddressChanged`: Triggered when the feeTo address is changed
-   `VerifierAddressChanged`: Triggered when the verifier address is changed
-   `CollectionCreated`: Triggered when a new collection is created
-   `MintCapUpdated`: Triggered when the mint cap of a collection is updated
-   `StartTimeUpdated`: Triggered when the start time of a collection is updated
-   `EndTimeUpdated`: Triggered when the end time of a collection is updated
-   `NFTMinted`: Triggered when a new NFT is minted

## Contract Functions

### `initialize`:

This function is called when the contract is first deployed. It initializes the contract with an address for revenue collection (\_`feeTo`) and an address for signature verification (\_`verifier`).

### `createCollection`:

This function creates a new collection of NFTs with the given parameters: `keyId`, `name`, `symbol`, `baseUri`, `paymentToken`, `mintCap`, `startTime`, and `endTime`.

### `mint`:

This function mints a new NFT in the given collection (specified by \_`collectionId`) with the given \_`tokenId`.

### `transferOwnership`:

This function transfers the ownership of an NFT from the current owner to the specified address (\_`to`).

### `changeFeeToAddress`:

This function changes the address to receive the revenue (`feeTo`).

### `changeVerifierAddress`:

This function changes the address used for signature verification (`verifier`).

### `updateMintCap`:

This function updates the `mintCap` of the specified collection.

### `updateStartTime`:

This function updates the `startTime` of the specified collection.

### `updateEndTime`:

This function updates the `endTime` of the specified collection.

### `veriySignature`:

This function verifies the `signature` if an user has right to mint an NFT.

### `getCollection`:

This function returns the details of the specified collection.

### `getCollectionByKeyId`:

This function returns the details of the collection with the given \_`keyId`.

### `getCollectionsByArtist`:

This function returns the collections created by the specified artist.

## Deployment & Testing

The contract implement ERC1967 proxy and must be deployed with the initialize function called immediately after deployment to set the feeTo and verifier addresses.

Provide your `INFURA_API_KEY`, `PRIVATE_KEY`, `ETHERSCAN_KEY` in env file as env.sample

### Prerequisites

Install all packages using

```console
npm install
```

Or if you are using yarn

```console
yarn
```

### Deploy

To deploy

```console
npx hardhat run scripts/deploy_all.ts --network <<NETWORK>>
```

Or if you are using yarn

```console
yarn hardhat run scripts/deploy_all.ts --network <<NETWORK>>
```

Replace `NETWORK` with the name of network you want to deploy to in Hardhat config

### Verify

After deployed, verify with

```console
npx hardhat run scripts/verify.ts --network <<NETWORK>>
```

Or if you are using yarn

```console
yarn hardhat run scripts/verify.ts --network <<NETWORK>>
```

Replace `NETWORK` with the name of network you want to deploy to in Hardhat config

### Testing

```console
npx hardhat test
```

Or if you are using yarn

```console
yarn hardhat test
```
