'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { bsc } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

let clientConfig: any = null;

function getClientConfig() {
  if (!clientConfig && typeof window !== 'undefined') {
    clientConfig = getDefaultConfig({
      appName: 'Wallet Persona',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
      chains: [bsc],
      ssr: false,
    });
  }
  return clientConfig;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const cfg = getClientConfig();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to initialize wagmi config:', error);
    }
  }, []);

  // Don't render children until config is available
  if (!config) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#6cff32',
          accentColorForeground: '#0e3900',
          borderRadius: 'medium',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}