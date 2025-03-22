'use client';
import { useAccount, useReadContract } from 'wagmi';
import { useSinglefact } from '@/hooks/useSinglefact';
import ButtonLink from '@/components/links/ButtonLink';
import { DocumentIcon, PlusIcon } from '@heroicons/react/24/outline';
import SinglefactABI from '@/contracts/Singlefact.json';
import { siteConfig } from '@/constant/config';
import { useEffect, useState } from 'react';

type AttestationDetails = {
  authority: string;
  attestationType: string;
  dataHash: string;
  timestamp: number;
  active: boolean;
};

export default function ManagePage() {
  const { address } = useAccount();
  const { attestations, loadingAttestations } = useSinglefact();
  const [attestationDetails, setAttestationDetails] = useState<Record<string, AttestationDetails>>({});

  const { data: details } = useReadContract({
    address: siteConfig.contractAddress as `0x${string}`,
    abi: SinglefactABI.abi,
    functionName: 'getAttestationDetails',
    args: [attestations?.[0]],
    enabled: Boolean(attestations?.length),
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!attestations?.length) return;

      const details: Record<string, AttestationDetails> = {};
      for (const id of attestations) {
        const result = await fetch(`/api/attestations/${id}`); // You'll need to create this API endpoint
        if (result.ok) {
          details[id] = await result.json();
        }
      }
      setAttestationDetails(details);
    };

    fetchDetails();
  }, [attestations]);

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
          {attestations?.map((attestationId: string) => {
            const details = attestationDetails[attestationId];
            return (
              <div
                key={attestationId}
                className='border rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <h3 className='font-semibold mb-2'>{details?.attestationType || 'Loading...'}</h3>
                <p className='text-sm text-gray-600 mb-2'>
                  Created: {details?.timestamp ? new Date(details.timestamp * 1000).toLocaleString() : 'Loading...'}
                </p>
                <p className='text-sm text-gray-600 mb-4 truncate'>
                  Hash: {details?.dataHash || 'Loading...'}
                </p>
                <div className='flex justify-between items-center'>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    details?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {details?.active ? 'Active' : 'Inactive'}
                  </span>
                  <ButtonLink href={`/verify/${attestationId}`} variant='light'>
                    View Details
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
