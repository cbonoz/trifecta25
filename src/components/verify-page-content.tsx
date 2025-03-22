'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useEthersSigner } from '@/app/contexts/useEthersSigner';
import { siteConfig } from '@/constant/config';
import { getAttestationDetails, validateAttestation } from '@/lib/methodCalls';
import { Attestation } from '@/lib/types';
import { AddressLink } from './ui/address-link';

export default function VerifyPageContent() {
  const { attestationId } = useParams();
  const [proof, setProof] = useState('');
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  // Separate loading states
  const [fetchLoading, setFetchLoading] = useState(true); // Loading state for fetching attestation
  const [verifyLoading, setVerifyLoading] = useState(false); // Loading state for proof verification
  const [error, setError] = useState<string | null>(null);
  const [verificationTime, setVerificationTime] = useState<Date | null>(null);
  const signer = useEthersSigner({ chainId: siteConfig.defaultChain.id });

  useEffect(() => {
    const loadAttestation = async () => {
      if (!attestationId || !signer) {
        return;
      }

      setFetchLoading(true);
      try {
        const details = await getAttestationDetails(signer, attestationId as string);
        setAttestation(details);
      } catch (error: any) {
        setError('Failed to load attestation details. Details may not exist or the attestation ID may not be correct.');
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    };

    loadAttestation();
  }, [attestationId, signer]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof || !attestation || !signer || !attestationId) return;

    setVerifyLoading(true); // Use verification-specific loading state
    setError(null);
    try {
      const isValid = await validateAttestation(signer, attestationId as string, proof);
      if (isValid) {
        setIsVerified(true);
        setVerificationTime(new Date());
      } else {
        setError('Invalid proof provided');
      }
    } catch (error: any) {
      console.error('Verification failed:', error);
      setError(error.message || 'Verification failed');
    }
    setVerifyLoading(false);
  };

  if (fetchLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
        <p className='mt-2'>Loading attestation details...</p>
      </div>
    );
  }

  if (!signer) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h2 className='text-xl font-bold'>Please connect your wallet</h2>
        <p className='mt-2 text-gray-600'>To verify the attestation, connect your wallet.</p>
      </div>
    );
  }

  if (!attestation && !fetchLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h2 className='text-xl font-bold text-red-600'>Attestation not found</h2>
        {error && <p className='mt-2 text-red-500'>{error}</p>}
      </div>
    );
  }

  if (!attestation) {
    return null; // Wait for the attestation to load
  }


  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <ShieldCheckIcon className='mx-auto h-12 w-12 text-primary-600' />
          <h1 className='mt-3 text-3xl font-bold'>Verify Attestation</h1>
          <p className='mt-2 text-gray-600'>
            Verify the authenticity of this attestation
          </p>
        </div>

        <div className='bg-white shadow rounded-lg p-6 space-y-6'>


          {/* Attestation Details */}
          <div>
            <h2 className='text-lg font-semibold mb-4'>Attestation Details</h2>
            <dl className='grid grid-cols-1 gap-3'>
              {attestation.active && <div>
                <dt className='text-sm font-medium text-gray-500'>Title</dt>
                <dd className='text-sm text-gray-900'>{attestation.title}</dd>
              </div>}
              {/* <div>
                <dt className='text-sm font-medium text-gray-500'>Description</dt>
                <dd className='text-sm text-gray-900'>{attestation.description}</dd>
              </div> */}

              <div>
                <dt className='text-sm font-medium text-gray-500'>Owner</dt>
                <AddressLink
              address={attestation.owner}
              chars={8}
              className='text-sm'
            />
              </div>
              <div>
                <dt className='text-sm font-medium text-gray-500'>Created</dt>
                <dd className='text-sm text-gray-900'>
                  {new Date(attestation.timestamp * 1000).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-gray-500'>Status</dt>
                <dd className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${attestation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {attestation.active ? 'Active' : 'Inactive'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Statement Section */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold mb-4'>Protected Statement</h3>
            {isVerified ? (
              <div className='bg-green-50 p-4 rounded-md'>
                <p className='text-green-700'>{attestation.statement}</p>
                {verificationTime && (
                  <div className='mt-3 pt-3 border-t border-green-200'>
                    <p className='text-sm text-green-600'>
                      <span className='font-medium'>Verification Time:</span> {verificationTime.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className='bg-gray-50 p-4 rounded-md flex items-center justify-center gap-2'>
                <LockClosedIcon className='h-5 w-5 text-gray-400' />
                <p className='text-gray-500'>{attestation.active ? 'Verify proof to reveal statement' : 'This record is inactive'}</p>
              </div>
            )}
          </div>

          {/* Verification Form */}
          {!isVerified && attestation.active && (
            <form onSubmit={handleVerification} className='border-t pt-6'>
              <div className='space-y-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Enter Proof
                  <textarea
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    placeholder="Enter the proof provided by the attestation owner"
                    required
                    disabled={verifyLoading} // Disable during verification
                  />
                </label>

                <button
                  type='submit'
                  disabled={verifyLoading}
                  className='w-full flex justify-center items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50'
                >
                  {verifyLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2' />
                      Verifying Proof...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>

                {error && (
                  <p className='text-red-500 text-sm text-center'>{error}</p>
                )}
              </div>
            </form>
          )}

          {/* Add verification result info */}
          {isVerified && (
            <div className='text-sm text-gray-600 mt-2 text-center'>
              <p>This verification has been recorded on the blockchain.</p>
              <p className='text-xs mt-1'>Transaction will be visible on the contract in a few minutes.</p>
            </div>
          )}
        </div>

            {/* Contract Link - New section */}
            <div className='text-right'>
            <AddressLink
              address={siteConfig.contractAddress}
              chars={6}
              className='text-sm text-primary-600 hover:text-primary-800'/>
          </div>
      </div>
    </div>
  );
}
