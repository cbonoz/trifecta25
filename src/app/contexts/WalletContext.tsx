// 'use client';

// import { coinbaseWallet } from '@wagmi/connectors';
// import { createContext, ReactNode, useContext } from 'react';
// import { useConnect, useDisconnect } from 'wagmi';

// import { siteConfig } from '@/constant/config';

// import { useEthersProvider } from './useEthersProvider';

// interface WalletContextType {
//   address: any;
//   provider: any;
//   connectWallet: () => Promise<void>;
//   signOut: () => void;
// }

// const WalletContext = createContext<WalletContextType>({
//   address: null,
//   provider: null,
//   connectWallet: async () => {
//     console.warn('connectWallet method not implemented');
//   },
//   signOut: () => {
//     console.warn('signOut method not implemented');
//   },
// });

// export function WalletProvider({ children }: { children: ReactNode }) {
//   const { connect } = useConnect();
//   const address = '';

//   const connector = coinbaseWallet({
//     appName: siteConfig.title,
//   });

//   const { disconnect } = useDisconnect();

//   const connectWallet = async () => {
//     try {
//       await connect({ connector });
//     } catch (err) {
//       console.error('Error connecting wallet:', err);
//     }
//   };

//   const signOut = () => {
//     try {
//       disconnect();
//     } catch (err) {
//       console.error('Error signing out:', err);
//     }
//   };

//   const provider = useEthersProvider({
//     chainId: siteConfig.defaultChain.id as any,
//   });

//   // Note: provider is handled by wagmi internally
//   return (
//     <WalletContext.Provider
//       value={{
//         address: address,
//         provider,
//         connectWallet,
//         signOut,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// }

// export const useWallet = () => useContext(WalletContext);
