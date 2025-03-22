import { requireEnv } from '@/util';
import { baseSepolia, sepolia } from 'wagmi/chains';

export const siteConfig = {
  title: 'Singlefact',
  titleTemplate: '%s | Singlefact',
  defaultTitle: 'Singlefact - ZK Attestation Management',
  defaultChain: sepolia,
  slogan:
    'A SaaS platform to manage your ZK attestations securely and efficiently.',
  description:
    'Singlefact provides a privacy-preserving ZK attestation management system, enabling businesses to validate identities and credentials without exposing sensitive data.',
  url: 'https://www.github.com/cbonoz/trifecta25',
  contractAddress: requireEnv(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, 'NEXT_PUBLIC_CONTRACT_ADDRESS'),
  zkBlueprint: requireEnv(process.env.NEXT_PUBLIC_ZK_BLUEPRINT, 'NEXT_PUBLIC_ZK_BLUEPRINT'),
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
    logo: '/images/singlefact-logo.png',
  },
  manifest: '/favicon/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: 'Singlefact',
    description: 'ZK Attestation Management SaaS Platform',
  },
  openGraph: {
    siteName: 'Singlefact',
    locale: 'en_US',
    type: 'website',
  },
  businessDescription:
    'Singlefact enables organizations to issue, verify, and manage zero-knowledge attestations, ensuring user privacy and security.',
  createBusinessHeading: 'Your ZK Attestation Management Solution',
  formTooltips: {
    businessName: 'The name of your organization managing ZK attestations',
    businessContext:
      'Details about your attestation use case, verification process, and compliance requirements',
    rewardThreshold:
      'Minimum criteria users must meet to receive a verified attestation',
    rewardAmount:
      'Any incentives provided to users upon successful attestation',
    paymentAddress:
      'Ethereum address for handling on-chain attestation transactions',
  },
};
