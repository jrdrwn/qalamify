'use client';

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork, defineChain } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_APPKIT_API_KEY || '';

// 2. Create a metadata object - optional
const metadata = {
  name: 'Qalamint',
  description: 'AppKit Example',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Define the custom network
const customNetwork = defineChain({
  id: 1337,
  name: 'Custom Network',
  caipNetworkId: 'eip155:1337',
  chainNamespace: 'eip155',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545/'],
    },
  },
});

// 3. Set the networks
const networks = [customNetwork] as [AppKitNetwork, ...AppKitNetwork[]];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
