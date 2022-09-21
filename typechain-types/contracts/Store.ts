/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface StoreInterface extends utils.Interface {
  functions: {
    "balanceOf(address)": FunctionFragment;
    "buyShirt(address[][],uint256[][])": FunctionFragment;
    "changeNFTWhitelistStatus(address[],bool[])": FunctionFragment;
    "eachShirtFee()": FunctionFragment;
    "estimateCost(address[][],uint256[][])": FunctionFragment;
    "getNFTStatus(address)": FunctionFragment;
    "initialize(address,uint256,uint256,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "percentRoyaltyFee()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEachShirtFee(uint256)": FunctionFragment;
    "setNFTAddress(address)": FunctionFragment;
    "setNFTOwner(address[],address[])": FunctionFragment;
    "setPercentRoyaltyFee(uint256)": FunctionFragment;
    "setShippingFee(uint256)": FunctionFragment;
    "shippingFee()": FunctionFragment;
    "shirtNFTAddress()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "whitelistNFT(address[],address[])": FunctionFragment;
    "withDraw()": FunctionFragment;
    "withDrawShirtFee()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balanceOf"
      | "buyShirt"
      | "changeNFTWhitelistStatus"
      | "eachShirtFee"
      | "estimateCost"
      | "getNFTStatus"
      | "initialize"
      | "owner"
      | "percentRoyaltyFee"
      | "renounceOwnership"
      | "setEachShirtFee"
      | "setNFTAddress"
      | "setNFTOwner"
      | "setPercentRoyaltyFee"
      | "setShippingFee"
      | "shippingFee"
      | "shirtNFTAddress"
      | "transferOwnership"
      | "whitelistNFT"
      | "withDraw"
      | "withDrawShirtFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "buyShirt",
    values: [PromiseOrValue<string>[][], PromiseOrValue<BigNumberish>[][]]
  ): string;
  encodeFunctionData(
    functionFragment: "changeNFTWhitelistStatus",
    values: [PromiseOrValue<string>[], PromiseOrValue<boolean>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "eachShirtFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "estimateCost",
    values: [PromiseOrValue<string>[][], PromiseOrValue<BigNumberish>[][]]
  ): string;
  encodeFunctionData(
    functionFragment: "getNFTStatus",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "percentRoyaltyFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEachShirtFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setNFTAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setNFTOwner",
    values: [PromiseOrValue<string>[], PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setPercentRoyaltyFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setShippingFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "shippingFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "shirtNFTAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistNFT",
    values: [PromiseOrValue<string>[], PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(functionFragment: "withDraw", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withDrawShirtFee",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyShirt", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeNFTWhitelistStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "eachShirtFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNFTStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "percentRoyaltyFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEachShirtFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNFTAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNFTOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPercentRoyaltyFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setShippingFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "shippingFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "shirtNFTAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withDraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withDrawShirtFee",
    data: BytesLike
  ): Result;

  events: {
    "EachShirtFeeChanged(uint256,uint256)": EventFragment;
    "NFTOwnerChanged(address,address,address)": EventFragment;
    "NFTWhitelistStatusChanged(address,bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RoyaltyFeeChanged(uint256,uint256)": EventFragment;
    "ShippingFeeChanged(uint256,uint256)": EventFragment;
    "ShirtCreated(address[],uint256[],address,uint256)": EventFragment;
    "ShirtNFTAddressChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EachShirtFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTOwnerChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NFTWhitelistStatusChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoyaltyFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ShippingFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ShirtCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ShirtNFTAddressChanged"): EventFragment;
}

export interface EachShirtFeeChangedEventObject {
  oldFee: BigNumber;
  newFee: BigNumber;
}
export type EachShirtFeeChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  EachShirtFeeChangedEventObject
>;

export type EachShirtFeeChangedEventFilter =
  TypedEventFilter<EachShirtFeeChangedEvent>;

export interface NFTOwnerChangedEventObject {
  nftAddress: string;
  newOwner: string;
  oldOwner: string;
}
export type NFTOwnerChangedEvent = TypedEvent<
  [string, string, string],
  NFTOwnerChangedEventObject
>;

export type NFTOwnerChangedEventFilter = TypedEventFilter<NFTOwnerChangedEvent>;

export interface NFTWhitelistStatusChangedEventObject {
  nftAddress: string;
  status: boolean;
}
export type NFTWhitelistStatusChangedEvent = TypedEvent<
  [string, boolean],
  NFTWhitelistStatusChangedEventObject
>;

export type NFTWhitelistStatusChangedEventFilter =
  TypedEventFilter<NFTWhitelistStatusChangedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface RoyaltyFeeChangedEventObject {
  oldFee: BigNumber;
  newFee: BigNumber;
}
export type RoyaltyFeeChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  RoyaltyFeeChangedEventObject
>;

export type RoyaltyFeeChangedEventFilter =
  TypedEventFilter<RoyaltyFeeChangedEvent>;

export interface ShippingFeeChangedEventObject {
  oldFee: BigNumber;
  newFee: BigNumber;
}
export type ShippingFeeChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  ShippingFeeChangedEventObject
>;

export type ShippingFeeChangedEventFilter =
  TypedEventFilter<ShippingFeeChangedEvent>;

export interface ShirtCreatedEventObject {
  nftAddresses: string[];
  tokenIds: BigNumber[];
  buyer: string;
  shirtTokenId: BigNumber;
}
export type ShirtCreatedEvent = TypedEvent<
  [string[], BigNumber[], string, BigNumber],
  ShirtCreatedEventObject
>;

export type ShirtCreatedEventFilter = TypedEventFilter<ShirtCreatedEvent>;

export interface ShirtNFTAddressChangedEventObject {
  oldAddress: string;
  newAddress: string;
}
export type ShirtNFTAddressChangedEvent = TypedEvent<
  [string, string],
  ShirtNFTAddressChangedEventObject
>;

export type ShirtNFTAddressChangedEventFilter =
  TypedEventFilter<ShirtNFTAddressChangedEvent>;

export interface Store extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StoreInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balanceOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    buyShirt(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeNFTWhitelistStatus(
      _nftAddresses: PromiseOrValue<string>[],
      _status: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    eachShirtFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    estimateCost(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { cost: BigNumber }>;

    getNFTStatus(
      _nftAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { owner: string; status: boolean }>;

    initialize(
      _nft: PromiseOrValue<string>,
      _shippingFee: PromiseOrValue<BigNumberish>,
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    percentRoyaltyFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setEachShirtFee(
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setNFTAddress(
      _shirtNFTAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setNFTOwner(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPercentRoyaltyFee(
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setShippingFee(
      _shippingFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    shippingFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    shirtNFTAddress(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    whitelistNFT(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withDraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withDrawShirtFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  balanceOf(
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  buyShirt(
    _nftAddresses: PromiseOrValue<string>[][],
    _tokenIds: PromiseOrValue<BigNumberish>[][],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeNFTWhitelistStatus(
    _nftAddresses: PromiseOrValue<string>[],
    _status: PromiseOrValue<boolean>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  eachShirtFee(overrides?: CallOverrides): Promise<BigNumber>;

  estimateCost(
    _nftAddresses: PromiseOrValue<string>[][],
    _tokenIds: PromiseOrValue<BigNumberish>[][],
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getNFTStatus(
    _nftAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string, boolean] & { owner: string; status: boolean }>;

  initialize(
    _nft: PromiseOrValue<string>,
    _shippingFee: PromiseOrValue<BigNumberish>,
    _eachShirtFee: PromiseOrValue<BigNumberish>,
    _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  percentRoyaltyFee(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setEachShirtFee(
    _eachShirtFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setNFTAddress(
    _shirtNFTAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setNFTOwner(
    _nftAddresses: PromiseOrValue<string>[],
    _nftOwners: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPercentRoyaltyFee(
    _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setShippingFee(
    _shippingFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  shippingFee(overrides?: CallOverrides): Promise<BigNumber>;

  shirtNFTAddress(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  whitelistNFT(
    _nftAddresses: PromiseOrValue<string>[],
    _nftOwners: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withDraw(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withDrawShirtFee(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyShirt(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: CallOverrides
    ): Promise<void>;

    changeNFTWhitelistStatus(
      _nftAddresses: PromiseOrValue<string>[],
      _status: PromiseOrValue<boolean>[],
      overrides?: CallOverrides
    ): Promise<void>;

    eachShirtFee(overrides?: CallOverrides): Promise<BigNumber>;

    estimateCost(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNFTStatus(
      _nftAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { owner: string; status: boolean }>;

    initialize(
      _nft: PromiseOrValue<string>,
      _shippingFee: PromiseOrValue<BigNumberish>,
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    percentRoyaltyFee(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEachShirtFee(
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setNFTAddress(
      _shirtNFTAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setNFTOwner(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setPercentRoyaltyFee(
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setShippingFee(
      _shippingFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    shippingFee(overrides?: CallOverrides): Promise<BigNumber>;

    shirtNFTAddress(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelistNFT(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    withDraw(overrides?: CallOverrides): Promise<void>;

    withDrawShirtFee(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "EachShirtFeeChanged(uint256,uint256)"(
      oldFee?: null,
      newFee?: null
    ): EachShirtFeeChangedEventFilter;
    EachShirtFeeChanged(
      oldFee?: null,
      newFee?: null
    ): EachShirtFeeChangedEventFilter;

    "NFTOwnerChanged(address,address,address)"(
      nftAddress?: null,
      newOwner?: null,
      oldOwner?: null
    ): NFTOwnerChangedEventFilter;
    NFTOwnerChanged(
      nftAddress?: null,
      newOwner?: null,
      oldOwner?: null
    ): NFTOwnerChangedEventFilter;

    "NFTWhitelistStatusChanged(address,bool)"(
      nftAddress?: null,
      status?: null
    ): NFTWhitelistStatusChangedEventFilter;
    NFTWhitelistStatusChanged(
      nftAddress?: null,
      status?: null
    ): NFTWhitelistStatusChangedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RoyaltyFeeChanged(uint256,uint256)"(
      oldFee?: null,
      newFee?: null
    ): RoyaltyFeeChangedEventFilter;
    RoyaltyFeeChanged(
      oldFee?: null,
      newFee?: null
    ): RoyaltyFeeChangedEventFilter;

    "ShippingFeeChanged(uint256,uint256)"(
      oldFee?: null,
      newFee?: null
    ): ShippingFeeChangedEventFilter;
    ShippingFeeChanged(
      oldFee?: null,
      newFee?: null
    ): ShippingFeeChangedEventFilter;

    "ShirtCreated(address[],uint256[],address,uint256)"(
      nftAddresses?: null,
      tokenIds?: null,
      buyer?: null,
      shirtTokenId?: null
    ): ShirtCreatedEventFilter;
    ShirtCreated(
      nftAddresses?: null,
      tokenIds?: null,
      buyer?: null,
      shirtTokenId?: null
    ): ShirtCreatedEventFilter;

    "ShirtNFTAddressChanged(address,address)"(
      oldAddress?: null,
      newAddress?: null
    ): ShirtNFTAddressChangedEventFilter;
    ShirtNFTAddressChanged(
      oldAddress?: null,
      newAddress?: null
    ): ShirtNFTAddressChangedEventFilter;
  };

  estimateGas: {
    balanceOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyShirt(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeNFTWhitelistStatus(
      _nftAddresses: PromiseOrValue<string>[],
      _status: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    eachShirtFee(overrides?: CallOverrides): Promise<BigNumber>;

    estimateCost(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNFTStatus(
      _nftAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _nft: PromiseOrValue<string>,
      _shippingFee: PromiseOrValue<BigNumberish>,
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    percentRoyaltyFee(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setEachShirtFee(
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setNFTAddress(
      _shirtNFTAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setNFTOwner(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPercentRoyaltyFee(
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setShippingFee(
      _shippingFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    shippingFee(overrides?: CallOverrides): Promise<BigNumber>;

    shirtNFTAddress(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    whitelistNFT(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withDraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withDrawShirtFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    buyShirt(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeNFTWhitelistStatus(
      _nftAddresses: PromiseOrValue<string>[],
      _status: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    eachShirtFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimateCost(
      _nftAddresses: PromiseOrValue<string>[][],
      _tokenIds: PromiseOrValue<BigNumberish>[][],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNFTStatus(
      _nftAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _nft: PromiseOrValue<string>,
      _shippingFee: PromiseOrValue<BigNumberish>,
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    percentRoyaltyFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setEachShirtFee(
      _eachShirtFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setNFTAddress(
      _shirtNFTAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setNFTOwner(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPercentRoyaltyFee(
      _percentRoyaltyFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setShippingFee(
      _shippingFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    shippingFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    shirtNFTAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    whitelistNFT(
      _nftAddresses: PromiseOrValue<string>[],
      _nftOwners: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withDraw(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withDrawShirtFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
