# Qalamify

Qalamify is a Next.js-based project that integrates blockchain technology to showcase and manage calligraphy NFTs (Non-Fungible Tokens). This project allows users to explore, create, and interact with unique digital calligraphy art.

## Features

- **Explore NFTs**: Browse through a collection of calligraphy NFTs.
- **Create NFTs**: Mint your own calligraphy NFTs and upload them to the blockchain.
- **User Profiles**: View and manage user profiles, including owned, created, and favorited NFTs.
- **Blockchain Integration**: Interact with smart contracts for NFT creation, transfer, and marketplace functionalities.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A blockchain wallet (e.g., MetaMask) for interacting with the application.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/qalamify.git
   cd qalamify
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_NFT_ADDRESS=<Your_NFT_Contract_Address>
   NEXT_PUBLIC_MARKET_ADDRESS=<Your_Marketplace_Contract_Address>
   NEXT_PUBLIC_PINATA_GATEWAY_URL=<Your_Pinata_Gateway_URL>
   PINATA_JWT=<Your_Pinata_JWT_Token>
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

- **`src/components`**: Contains reusable UI components and feature-specific components.
- **`src/app`**: Includes the main application logic, API routes, and layout configuration.
- **`src/app/abis`**: Stores the ABI (Application Binary Interface) files for smart contracts.
- **`src/app/api`**: API routes for interacting with Pinata and blockchain data.
- **`src/app/globals.css`**: Global CSS styles for the application.

## Smart Contracts

This project uses two main smart contracts:

1. **KaligrafiNFT**: Manages NFT creation, ownership, and user profiles.
2. **Marketplace**: Handles NFT marketplace functionalities such as listing, buying, and selling.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Wagmi Documentation](https://wagmi.sh/) - React hooks for Ethereum.
- [Pinata Documentation](https://docs.pinata.cloud/) - Manage IPFS files and metadata.

## Deployment

The easiest way to deploy this application is through [Vercel](https://vercel.com/). Follow the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
