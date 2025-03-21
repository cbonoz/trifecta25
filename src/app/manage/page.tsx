'use client';
import { useAccount } from 'wagmi';
import { useSinglefact } from '@/hooks/useSinglefact';
import ButtonLink from '@/components/links/ButtonLink';
import { DocumentIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ManagePage() {
  const { address } = useAccount();
  const { attestations, loadingAttestations } = useSinglefact();

  if (!address) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>Please connect your wallet</h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Attestations</h1>
        <ButtonLink href='/manage/upload' variant='light'>
          <PlusIcon className='h-5 w-5 mr-2' />
          Create Attestation
        </ButtonLink>
      </div>

      {loadingAttestations ? (
        <p>Loading attestations...</p>
      ) : attestations?.length === 0 ? (
        <div className='text-center py-12'>
          <DocumentIcon className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-semibold text-gray-900'>No attestations</h3>
          <p className='mt-1 text-sm text-gray-500'>
            Get started by creating a new attestation.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {attestations?.map((attestationId: string) => (
            <div
              key={attestationId}
              className='border rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <h3 className='font-semibold truncate'>{attestationId}</h3>
              <div className='mt-2 flex justify-end'>
                <ButtonLink href={`/verify/${attestationId}`} variant='light'>
                  View Details
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
