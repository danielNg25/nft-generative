/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { NFT, NFTInterface } from "../../contracts/NFT";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "baseUri",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
    ],
    name: "AddMinter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
    ],
    name: "RemoveMinter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "isMinter",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeMint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isMinter",
        type: "bool",
      },
    ],
    name: "setMinterStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseUri",
        type: "string",
      },
    ],
    name: "setURIPrefix",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "tokensOfOwner",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001f7a38038062001f7a833981016040819052620000349162000276565b8251839083906200004d90600090602085019062000103565b5080516200006390600190602084019062000103565b505050620000806200007a6200009460201b60201c565b62000098565b6200008b81620000ea565b50505062000344565b3390565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b8051620000ff90600b90602084019062000103565b5050565b828054620001119062000307565b90600052602060002090601f01602090048101928262000135576000855562000180565b82601f106200015057805160ff191683800117855562000180565b8280016001018555821562000180579182015b828111156200018057825182559160200191906001019062000163565b506200018e92915062000192565b5090565b5b808211156200018e576000815560010162000193565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001d157600080fd5b81516001600160401b0380821115620001ee57620001ee620001a9565b604051601f8301601f19908116603f01168101908282118183101715620002195762000219620001a9565b816040528381526020925086838588010111156200023657600080fd5b600091505b838210156200025a57858201830151818301840152908201906200023b565b838211156200026c5760008385830101525b9695505050505050565b6000806000606084860312156200028c57600080fd5b83516001600160401b0380821115620002a457600080fd5b620002b287838801620001bf565b94506020860151915080821115620002c957600080fd5b620002d787838801620001bf565b93506040860151915080821115620002ee57600080fd5b50620002fd86828701620001bf565b9150509250925092565b600181811c908216806200031c57607f821691505b602082108114156200033e57634e487b7160e01b600052602260045260246000fd5b50919050565b611c2680620003546000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c806370a08231116100de578063a22cb46511610097578063c87b56dd11610071578063c87b56dd1461033a578063e985e9c51461034d578063f00c298d14610389578063f2fde38b1461039c57600080fd5b8063a22cb465146102e8578063aa271e1a146102fb578063b88d4fde1461032757600080fd5b806370a0823114610281578063715018a6146102945780638462151c1461029c5780638da5cb5b146102bc57806395d89b41146102cd578063a1448194146102d557600080fd5b80632f745c59116101305780632f745c591461021a57806342842e0e1461022d5780634f6ccce7146102405780636352211e146102535780636bff2c24146102665780636c0360eb1461027957600080fd5b806301ffc9a71461017857806306fdde03146101a0578063081812fc146101b5578063095ea7b3146101e057806318160ddd146101f557806323b872dd14610207575b600080fd5b61018b610186366004611680565b6103af565b60405190151581526020015b60405180910390f35b6101a86103c0565b60405161019791906116f5565b6101c86101c3366004611708565b610452565b6040516001600160a01b039091168152602001610197565b6101f36101ee36600461173d565b610479565b005b6008545b604051908152602001610197565b6101f3610215366004611767565b610594565b6101f961022836600461173d565b6105c5565b6101f361023b366004611767565b61065b565b6101f961024e366004611708565b610676565b6101c8610261366004611708565b610709565b6101f361027436600461182f565b610769565b6101a861077d565b6101f961028f366004611878565b61078c565b6101f3610812565b6102af6102aa366004611878565b610826565b6040516101979190611893565b600a546001600160a01b03166101c8565b6101a86108c8565b61018b6102e336600461173d565b6108d7565b6101f36102f63660046118d7565b61093e565b61018b610309366004611878565b6001600160a01b03166000908152600c602052604090205460ff1690565b6101f3610335366004611913565b61094d565b6101a8610348366004611708565b610985565b61018b61035b36600461198f565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6101f36103973660046118d7565b610990565b6101f36103aa366004611878565b6109c3565b60006103ba82610a39565b92915050565b6060600080546103cf906119c2565b80601f01602080910402602001604051908101604052809291908181526020018280546103fb906119c2565b80156104485780601f1061041d57610100808354040283529160200191610448565b820191906000526020600020905b81548152906001019060200180831161042b57829003601f168201915b5050505050905090565b600061045d82610a5e565b506000908152600460205260409020546001600160a01b031690565b600061048482610709565b9050806001600160a01b0316836001600160a01b031614156104f75760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806105135750610513813361035b565b6105855760405162461bcd60e51b815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c000060648201526084016104ee565b61058f8383610abd565b505050565b61059e3382610b2b565b6105ba5760405162461bcd60e51b81526004016104ee906119fd565b61058f838383610baa565b60006105d08361078c565b82106106325760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b60648201526084016104ee565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b61058f8383836040518060200160405280600081525061094d565b600061068160085490565b82106106e45760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b60648201526084016104ee565b600882815481106106f7576106f7611a4b565b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b0316806103ba5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016104ee565b610771610d51565b61077a81610dab565b50565b6060610787610dbe565b905090565b60006001600160a01b0382166107f65760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016104ee565b506001600160a01b031660009081526003602052604090205490565b61081a610d51565b6108246000610dcd565b565b606060006108338361078c565b905060008167ffffffffffffffff811115610850576108506117a3565b604051908082528060200260200182016040528015610879578160200160208202803683370190505b50905060005b828110156108c05761089185826105c5565b8282815181106108a3576108a3611a4b565b6020908102919091010152806108b881611a77565b91505061087f565b509392505050565b6060600180546103cf906119c2565b336000908152600c602052604081205460ff1661092b5760405162461bcd60e51b81526020600482015260126024820152712932b9ba3934b1ba103a379026b4b73a32b960711b60448201526064016104ee565b6109358383610e1f565b50600192915050565b610949338383610e39565b5050565b6109573383610b2b565b6109735760405162461bcd60e51b81526004016104ee906119fd565b61097f84848484610f08565b50505050565b60606103ba82610f3b565b610998610d51565b6001600160a01b03919091166000908152600c60205260409020805460ff1916911515919091179055565b6109cb610d51565b6001600160a01b038116610a305760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104ee565b61077a81610dcd565b60006001600160e01b0319821663780e9d6360e01b14806103ba57506103ba82610fa2565b6000818152600260205260409020546001600160a01b031661077a5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016104ee565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610af282610709565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610b3783610709565b9050806001600160a01b0316846001600160a01b03161480610b7e57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b80610ba25750836001600160a01b0316610b9784610452565b6001600160a01b0316145b949350505050565b826001600160a01b0316610bbd82610709565b6001600160a01b031614610c215760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b60648201526084016104ee565b6001600160a01b038216610c835760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016104ee565b610c8e838383610ff2565b610c99600082610abd565b6001600160a01b0383166000908152600360205260408120805460019290610cc2908490611a92565b90915550506001600160a01b0382166000908152600360205260408120805460019290610cf0908490611aa9565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600a546001600160a01b031633146108245760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104ee565b805161094990600b9060208401906115d1565b6060600b80546103cf906119c2565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610949828260405180602001604052806000815250610ffd565b816001600160a01b0316836001600160a01b03161415610e9b5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104ee565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610f13848484610baa565b610f1f84848484611030565b61097f5760405162461bcd60e51b81526004016104ee90611ac1565b6060610f4682610a5e565b6000610f50610dbe565b90506000815111610f705760405180602001604052806000815250610f9b565b80610f7a8461113d565b604051602001610f8b929190611b13565b6040516020818303038152906040525b9392505050565b60006001600160e01b031982166380ac58cd60e01b1480610fd357506001600160e01b03198216635b5e139f60e01b145b806103ba57506301ffc9a760e01b6001600160e01b03198316146103ba565b61058f83838361123b565b61100783836112f3565b6110146000848484611030565b61058f5760405162461bcd60e51b81526004016104ee90611ac1565b60006001600160a01b0384163b1561113257604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611074903390899088908890600401611b42565b602060405180830381600087803b15801561108e57600080fd5b505af19250505080156110be575060408051601f3d908101601f191682019092526110bb91810190611b7f565b60015b611118573d8080156110ec576040519150601f19603f3d011682016040523d82523d6000602084013e6110f1565b606091505b5080516111105760405162461bcd60e51b81526004016104ee90611ac1565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610ba2565b506001949350505050565b6060816111615750506040805180820190915260018152600360fc1b602082015290565b8160005b811561118b578061117581611a77565b91506111849050600a83611bb2565b9150611165565b60008167ffffffffffffffff8111156111a6576111a66117a3565b6040519080825280601f01601f1916602001820160405280156111d0576020820181803683370190505b5090505b8415610ba2576111e5600183611a92565b91506111f2600a86611bc6565b6111fd906030611aa9565b60f81b81838151811061121257611212611a4b565b60200101906001600160f81b031916908160001a905350611234600a86611bb2565b94506111d4565b6001600160a01b0383166112965761129181600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b6112b9565b816001600160a01b0316836001600160a01b0316146112b9576112b98382611441565b6001600160a01b0382166112d05761058f816114de565b826001600160a01b0316826001600160a01b03161461058f5761058f828261158d565b6001600160a01b0382166113495760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016104ee565b6000818152600260205260409020546001600160a01b0316156113ae5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104ee565b6113ba60008383610ff2565b6001600160a01b03821660009081526003602052604081208054600192906113e3908490611aa9565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6000600161144e8461078c565b6114589190611a92565b6000838152600760205260409020549091508082146114ab576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b6008546000906114f090600190611a92565b6000838152600960205260408120546008805493945090928490811061151857611518611a4b565b90600052602060002001549050806008838154811061153957611539611a4b565b600091825260208083209091019290925582815260099091526040808220849055858252812055600880548061157157611571611bda565b6001900381819060005260206000200160009055905550505050565b60006115988361078c565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b8280546115dd906119c2565b90600052602060002090601f0160209004810192826115ff5760008555611645565b82601f1061161857805160ff1916838001178555611645565b82800160010185558215611645579182015b8281111561164557825182559160200191906001019061162a565b50611651929150611655565b5090565b5b808211156116515760008155600101611656565b6001600160e01b03198116811461077a57600080fd5b60006020828403121561169257600080fd5b8135610f9b8161166a565b60005b838110156116b85781810151838201526020016116a0565b8381111561097f5750506000910152565b600081518084526116e181602086016020860161169d565b601f01601f19169290920160200192915050565b602081526000610f9b60208301846116c9565b60006020828403121561171a57600080fd5b5035919050565b80356001600160a01b038116811461173857600080fd5b919050565b6000806040838503121561175057600080fd5b61175983611721565b946020939093013593505050565b60008060006060848603121561177c57600080fd5b61178584611721565b925061179360208501611721565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156117d4576117d46117a3565b604051601f8501601f19908116603f011681019082821181831017156117fc576117fc6117a3565b8160405280935085815286868601111561181557600080fd5b858560208301376000602087830101525050509392505050565b60006020828403121561184157600080fd5b813567ffffffffffffffff81111561185857600080fd5b8201601f8101841361186957600080fd5b610ba2848235602084016117b9565b60006020828403121561188a57600080fd5b610f9b82611721565b6020808252825182820181905260009190848201906040850190845b818110156118cb578351835292840192918401916001016118af565b50909695505050505050565b600080604083850312156118ea57600080fd5b6118f383611721565b91506020830135801515811461190857600080fd5b809150509250929050565b6000806000806080858703121561192957600080fd5b61193285611721565b935061194060208601611721565b925060408501359150606085013567ffffffffffffffff81111561196357600080fd5b8501601f8101871361197457600080fd5b611983878235602084016117b9565b91505092959194509250565b600080604083850312156119a257600080fd5b6119ab83611721565b91506119b960208401611721565b90509250929050565b600181811c908216806119d657607f821691505b602082108114156119f757634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602e908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526d1c881b9bdc88185c1c1c9bdd995960921b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019821415611a8b57611a8b611a61565b5060010190565b600082821015611aa457611aa4611a61565b500390565b60008219821115611abc57611abc611a61565b500190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60008351611b2581846020880161169d565b835190830190611b3981836020880161169d565b01949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611b75908301846116c9565b9695505050505050565b600060208284031215611b9157600080fd5b8151610f9b8161166a565b634e487b7160e01b600052601260045260246000fd5b600082611bc157611bc1611b9c565b500490565b600082611bd557611bd5611b9c565b500690565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220d6cf46beb034a141bd6ef22362115f343d07af16b2d499de9537c7bf9897c93d64736f6c63430008090033";

type NFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFT__factory extends ContractFactory {
  constructor(...args: NFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    baseUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<NFT> {
    return super.deploy(
      _name,
      _symbol,
      baseUri,
      overrides || {}
    ) as Promise<NFT>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    baseUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, _symbol, baseUri, overrides || {});
  }
  override attach(address: string): NFT {
    return super.attach(address) as NFT;
  }
  override connect(signer: Signer): NFT__factory {
    return super.connect(signer) as NFT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTInterface {
    return new utils.Interface(_abi) as NFTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): NFT {
    return new Contract(address, _abi, signerOrProvider) as NFT;
  }
}
