'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { DocumentCheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { siteConfig } from '@/constant/config';
import SinglefactABI from '@/contracts/Singlefact.json';
import { useSinglefact } from '@/hooks/useSinglefact';

type AttestationDetails = {
  authority: `0x${string}`;
  attestationType: string;
  dataHash: `0x${string}`;
  timestamp: bigint;
  active: boolean;
};

type Params = {
  id: string;
};

export default function VerifyPageContent() {
  const { id } = useParams<Params>();
  const [file, setFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { generateDocumentHash, verifyAttestation } = useSinglefact();

  const { data: attestationDetails, isLoading } = useReadContract<
    typeof SinglefactABI.abi,
    'getAttestationDetails',
    AttestationDetails
  >({
    address: siteConfig.contractAddress as `0x${string}`,
    abi: SinglefactABI.abi,
    functionName: 'getAttestationDetails',
    args: [id as `0x${string}`],
  });

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const hash = await generateDocumentHash(file);
      const verification = new Uint8Array([1, 2, 3, 4]);
      const result = await verifyAttestation(id as string, verification);
      setVerificationStatus(Boolean(result));
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus(false);
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
        <p className='mt-2'>Loading attestation details...</p>
      </div>
    );
  }

  if (!attestationDetails) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h2 className='text-xl font-bold text-red-600'>Attestation not found</h2>
      </div>
    );
  }

  // TODO: implement page
  return <div></div>

}
