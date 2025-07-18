export const MARKETPLACE_NFT = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'IncorrectPriceSent',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ItemAlreadyCanceled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ItemAlreadySold',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ItemCanceled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketItemDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotSeller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PriceMustBeGreaterThanZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
    ],
    name: 'MarketItemCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'sold',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'canceled',
        type: 'bool',
      },
    ],
    name: 'MarketItemCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'MarketItemRelisted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'MarketItemSold',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
    ],
    name: 'cancelMarketItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'createMarketItem',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
    ],
    name: 'createMarketSale',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fetchAllAvailableMarketItems',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'marketItemId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftContractAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'sold',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
        ],
        internalType: 'struct Marketplace.MarketItem[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'offset',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: 'limit',
        type: 'int256',
      },
    ],
    name: 'fetchAvailableMarketItems',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'marketItemId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftContractAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'sold',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
        ],
        internalType: 'struct Marketplace.MarketItem[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'offset',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: 'limit',
        type: 'int256',
      },
    ],
    name: 'fetchAvailableMarketItemsWithMetadata',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'marketItemId',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'nftContractAddress',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
              },
              {
                internalType: 'address payable',
                name: 'creator',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'seller',
                type: 'address',
              },
              {
                internalType: 'address payable',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'sold',
                type: 'bool',
              },
              {
                internalType: 'bool',
                name: 'canceled',
                type: 'bool',
              },
            ],
            internalType: 'struct Marketplace.MarketItem',
            name: 'item',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'calligraphyStyle',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'presentationStyle',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'composition',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'decoration',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'dominantColor',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'mintingAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct KaligrafiNFT.TokenMetadata',
            name: 'metadata',
            type: 'tuple',
          },
        ],
        internalType: 'struct Marketplace.MarketItemWithMetadata[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
    ],
    name: 'fetchItemsBySeller',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'marketItemId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftContractAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'sold',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
        ],
        internalType: 'struct Marketplace.MarketItem[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getListingFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
    ],
    name: 'getMarketItemById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'marketItemId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftContractAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'sold',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
        ],
        internalType: 'struct Marketplace.MarketItem',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getMarketItemByTokenId',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'marketItemId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftContractAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'sold',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'canceled',
            type: 'bool',
          },
        ],
        internalType: 'struct Marketplace.MarketItem',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserStatistics',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sales',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'revenue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'royaltyEarned',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftContractAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'marketItemId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'relistMarketItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'totalRevenue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'totalRoyaltyEarned',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'totalSales',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
