import { siteConfig } from '@/constant/config';
import {  metaMask } from '@wagmi/connectors';
import { sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

export const metamaskConnector = metaMask();

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metamaskConnector
  ],
  transports: {
    [sepolia.id]: http(),
  }
});
