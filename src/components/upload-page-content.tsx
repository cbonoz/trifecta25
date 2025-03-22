'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSinglefact } from '@/hooks/useSinglefact';
import { useAccount } from 'wagmi';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import { useEthersSigner } from '@/app/contexts/useEthersSigner';
import { siteConfig } from '@/constant/config';
import { createAttestation } from '@/lib/methodCalls';
import { DEMO_DATA } from '@/constant';

export default function UploadPageContent() {
  const router = useRouter();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    statement: '',
    proof: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signer = useEthersSigner({
    chainId: siteConfig.defaultChain.id as any,
  });

  if (!address) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Please connect your wallet</h1>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !signer) return;

    setLoading(true);
    setError(null);

    try {
      await createAttestation(signer, {
        title: formData.title,
        description: formData.description,
        statement: formData.statement,
        proof: formData.proof,
        file: formData.file,
      });
      router.push('/manage');
    } catch (error: any) {
      setError(error.message || 'Error creating attestation');
    }
    setLoading(false);
  };

  const loadDemoData = () => {
    setFormData(prevState => ({
      ...prevState,
      title: DEMO_DATA.title,
      description: DEMO_DATA.description,
      statement: DEMO_DATA.statement,
      proof: DEMO_DATA.proof
    }));
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-2xl font-bold'>Create New Attestation</h1>
        <button
          type="button"
          onClick={loadDemoData}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
        >
          <span className="mr-1">Load Demo Data</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className='max-w-lg space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Title</label>
          <input
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Description</label>
          <textarea
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Statement to Prove</label>
          <textarea
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.statement}
            onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
            required
            placeholder="e.g., 'I am over 18 years old' or 'I have a balance over $10,000'"
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Proof
            <span className='text-xs text-gray-500 ml-2'>
              (Base64 encoded ZK proof)
            </span>
          </label>
          <textarea
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.proof}
            onChange={(e) => setFormData({ ...formData, proof: e.target.value })}
            required
            placeholder="Paste your generated ZK proof here"
          />
          <p className='mt-1 text-sm text-amber-600'>
            Note: Share this proof separately with your verifier. It will be used to validate your attestation.
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Document</label>
          <input
            type='file'
            className='mt-1 block w-full'
            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50'
        >
          {loading ? 'Creating...' : 'Create Attestation'}
        </button>

        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </form>
    </div>
  );
}
