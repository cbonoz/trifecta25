import '@/lib/env';
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  LockClosedIcon,
  KeyIcon,
  CheckBadgeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import { siteConfig } from '@/constant/config';

const features = [
  {
    icon: <LockClosedIcon className="h-6 w-6" />,
    title: "Privacy First",
    description: "Verify documents without revealing sensitive information"
  },
  {
    icon: <KeyIcon className="h-6 w-6" />,
    title: "Zero Knowledge Proofs",
    description: "Generate and verify ZK proofs for document attestation"
  },
  {
    icon: <CheckBadgeIcon className="h-6 w-6" />,
    title: "Email Integration",
    description: "Verify email-based documents with ZK Email"
  },
  {
    icon: <DocumentDuplicateIcon className="h-6 w-6" />,
    title: "On-chain Verification",
    description: "Immutable record of attestations and verifications"
  }
];

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>{siteConfig.titleTemplate.replace('%s', 'Home')}</title>
      </Head>

      {/* Hero Section */}
      <section className='bg-gradient-to-b from-primary-50 to-white'>
        <div className='layout relative flex min-h-[80vh] flex-col items-center justify-center py-12 text-center px-4'>
          <ShieldCheckIcon className='h-20 w-20 text-primary-600 mb-6' />
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            {siteConfig.title}
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mb-8'>{siteConfig.slogan}</p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/manage/upload'
              className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors'
            >
              Create Attestation
            </Link>
            <Link
              href='/about'
              className='border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors'
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Key Features</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-primary-900 text-white py-16 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
          <p className='text-primary-100 mb-8 text-lg'>
            Join the future of privacy-preserving document verification
          </p>
          <Link
            href='/manage'
            className='inline-block bg-white text-primary-900 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors'
          >
            Start Verifying
          </Link>
        </div>
      </section>

      <footer className='py-6 text-center text-gray-600'>
        {siteConfig.title} &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
