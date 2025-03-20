import { AddressLink } from '@/components/ui/address-link';
import { siteConfig } from '@/constant/config';

export default function AboutPage() {
  const integrations = [
    {
      name: 'Coinbase Developer Platform',
      description: 'SmartWallets, Agentkit, OnchainKit, Coinbase SDK',
      benefit:
        'Custom prompt fed into deployment on Autonome with secure contract interactions.',
    },
    {
      name: 'Base',
      description: 'Base blockchain and payments ecosystem',
      benefit:
        'Core blockchain infrastructure with deployed solidity smart contracts.',
    },
    {
      name: 'Autonome',
      description: 'AgentKit deployment and hosting platform',
      benefit:
        'Streamlined deployment and management of AI-powered loyalty systems.',
    },
    {
      name: 'Nethermind',
      description: 'Commerce AI integrated with deployed Ethereum contract',
      benefit:
        'The AI agent is connected to the primary contract deployment and can perform an initial set of actions like checking rewards balance, redemptions, and asking questions about the store based on input provided by the owner.',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>
            About Singlefact
          </h1>

          {/* Contract Info */}
          <div className='mb-12 text-left bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Smart Contract</h2>
            <p className='text-gray-600 mb-2'>
              Singlefact is deployed on {siteConfig.defaultChain.name} at:
            </p>
            <AddressLink
              address={siteConfig.contractAddress}
              chars={8}
              className='text-lg'
            />
          </div>

          {/* Project Overview */}
          <div className='mb-12 text-left bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Project Overview</h2>
            <p className='text-gray-600 mb-6'>
              Singlefact is a Web3 QR code system that enables users to scan QR
              codes at the point of attestation and get loyalty rewards attached to
              their account.
            </p>

            <h3 className='text-xl font-semibold mb-3'>Core Features:</h3>
            <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
              <li>
                Business QR code setup with configurable reward thresholds
              </li>
              <li>Custom attestation page tailored to your business prompt</li>
              <li>
                AI agent integration for transaction and loyalty management
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div className='grid md:grid-cols-2 gap-6'>
            {integrations.map((integration, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-lg p-6 text-left'
              >
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {integration.name}
                </h3>
                <p className='text-gray-600 mb-3'>{integration.description}</p>
                <p className='text-sm text-gray-500'>
                  <span className='font-medium'>Benefit:</span>{' '}
                  {integration.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
