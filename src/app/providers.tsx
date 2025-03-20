'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import NavBar from './components/nav-bar';
import { config } from './contexts/wagmiConfig';

const queryClient = new QueryClient();

interface Props {
  initialState: any;
  children: React.ReactNode;
}

export function Providers({ children, initialState }: Props) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia as any} // add baseSepolia for testing
        >
          <NavBar />
          {/* <WalletProvider> */}
          {children}
        </OnchainKitProvider>
        {/* </WalletProvider> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
