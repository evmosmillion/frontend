export default `[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "spotIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newBid",
				"type": "uint256"
			}
		],
		"name": "bumpUp",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_x",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_y",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_width",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_height",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "bid",
				"type": "uint256"
			}
		],
		"name": "buySpot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "spotIndex",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "spotIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_nsfw",
				"type": "bool"
			}
		],
		"name": "forceNsfw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractOwner",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_withdrawWallet",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "test",
				"type": "uint256"
			}
		],
		"name": "Info",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "spotIndex",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "setAdOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "spotIndex",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_nsfw",
				"type": "bool"
			}
		],
		"name": "updateSpot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "activeSpots",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "activeSpotsLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "grid",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pixelsPerCell",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "priceSteps",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "spots",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "x",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "y",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "width",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "height",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "coveredArea",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "bid",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "link",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "nsfw",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "forceNsfw",
				"type": "bool"
			},
			{
				"internalType": "uint16",
				"name": "activeSpotsIndex",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "spotsLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`;