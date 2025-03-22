import { AddressLink } from '@/components/ui/address-link';
import { siteConfig } from '@/constant/config';

export default function AboutPage() {
  const integrations = [
    {
      name: 'ZK Email Integration',
      description: 'Secure email-based document verification',
      benefit:
        'Verify documents received via email without revealing contents using zero-knowledge proofs.',
    },
    {
      name: 'Succinct',
      description: 'Zero-knowledge proof generation and verification',
      benefit:
        'Enables privacy-preserving document verification without exposing sensitive data.',
    },
    {
      name: 'Smart Contract System',
      description: 'Decentralized attestation management',
      benefit:
        'Transparent, immutable record of attestations with built-in privacy controls.',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>
            About {siteConfig.title}
          </h1>

          {/* Contract Info */}
          <div className='mb-12 text-left bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Main Contract</h2>
            <p className='text-gray-600 mb-2'>
              Deployed on {siteConfig.defaultChain.name} at:
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
            <p className='text-gray-600 mb-6'>{siteConfig.description}</p>

            <h3 className='text-xl font-semibold mb-3'>Core Features:</h3>
            <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
              <li>Privacy-preserving document verification</li>
              <li>Zero-knowledge proof generation for sensitive data</li>
              <li>Email-based document attestation</li>
              <li>On-chain verification records</li>
              <li>Decentralized authority management</li>
            </ul>

            {/* Disclaimer - more discrete version */}
            <div className='mt-6 border-t pt-4 text-sm'>
              <p className='text-gray-500 italic'>
                <span className='font-medium'>Note:</span> This application was developed as a
                hackathon prototype and is provided as-is. Use or trial at your own discretion.
              </p>
            </div>
          </div>

          {/* Use Cases */}
          <div className='mb-12 text-left bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold mb-4'>Common Use Cases</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>Age verification without sharing full ID</li>
              <li>Income verification without revealing bank statements</li>
              <li>Educational credentials without exposing transcripts</li>
              <li>Employment verification without sharing contracts</li>
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
