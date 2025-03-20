import { siteConfig } from '@/constant/config';
import { coinbaseWallet } from '@wagmi/connectors';
import { sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

export const coinbaseConnector = coinbaseWallet({
  appName: siteConfig.title,
});

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  }
});
