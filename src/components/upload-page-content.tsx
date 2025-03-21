'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSinglefact } from '@/hooks/useSinglefact';
import { useAccount } from 'wagmi';

export default function UploadPageContent() {
  const router = useRouter();
  const { address } = useAccount();
  const { createAttestation } = useSinglefact();
  const [formData, setFormData] = useState({
    attestationType: '',
    document: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  if (!address) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Please connect your wallet</h1>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Generate ZK proof from document
      const zkProof = '0x...';
      const functionId = '0x...';
      const dataHash = '0x...';

      await createAttestation({
        args: [formData.attestationType, dataHash, functionId, zkProof],
      });
      router.push('/manage');
    } catch (error) {
      console.error('Error creating attestation:', error);
    }
    setLoading(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Create New Attestation</h1>
      <form onSubmit={handleSubmit} className='max-w-lg'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Attestation Type
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              value={formData.attestationType}
              onChange={(e) =>
                setFormData({ ...formData, attestationType: e.target.value })
              }
              required
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Document
            <input
              type='file'
              className='mt-1 block w-full'
              onChange={(e) =>
                setFormData({ ...formData, document: e.target.files?.[0] || null })
              }
              required
            />
          </label>
        </div>
        <button
          type='submit'
          disabled={loading}
          className='bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700'
        >
          {loading ? 'Creating...' : 'Create Attestation'}
        </button>
      </form>
    </div>
  );
}
