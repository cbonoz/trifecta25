'use client';
import { useAccount } from 'wagmi';
import ButtonLink from '@/components/links/ButtonLink';
import { DocumentIcon, EnvelopeIcon, PlusIcon, ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Attestation } from '@/lib/types';
import { getAttestations } from '@/lib/methodCalls';
import { useEthersSigner } from '@/app/contexts/useEthersSigner';
import { siteConfig } from '@/constant/config';
import { Dialog } from '@headlessui/react';
import { generateAttestationEmailContent } from '@/util';

export default function ManagePage() {
  const { address } = useAccount();
  const signer = useEthersSigner({ chainId: siteConfig.defaultChain.id });
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttestation, setSelectedAttestation] = useState<Attestation | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadAttestations = async () => {
      if (!signer) return;
      try {
        setLoading(true);
        const atts = await getAttestations(signer);
        setAttestations(atts);
      } catch (error) {
        console.error('Error loading attestations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttestations();
  }, [signer]);

  const handleShareViaEmail = (attestation: Attestation) => {
    setSelectedAttestation(attestation);
    setEmailModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {loading ? (
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
          {attestations.map((attestation) => (
            <div
              key={attestation.id}
              className='border rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <h3 className='font-semibold mb-2'>{attestation.title}</h3>
              <p className='text-sm text-gray-600 mb-2'>{attestation.description}</p>
              <p className='text-sm text-gray-600 mb-2 truncate'>
                Statement: {attestation.statement}
              </p>
              <p className='text-sm text-gray-600 mb-2'>
                Created: {new Date(attestation.timestamp * 1000).toLocaleString()}
              </p>
              <div className='flex justify-between items-center mt-4'>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  attestation.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {attestation.active ? 'Active' : 'Inactive'}
                </span>

                <div className='flex space-x-2'>
                  <button
                    onClick={() => handleShareViaEmail(attestation)}
                    className='flex items-center text-gray-600 hover:text-primary-600 text-sm'
                  >
                    <EnvelopeIcon className='h-5 w-5 mr-1' />
                    Email
                  </button>

                  <ButtonLink href={`/verify/${attestation.id}`} variant='light'>
                    View
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Content Modal */}
      <Dialog
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6 shadow-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">Email Content</Dialog.Title>
              <span className="text-sm text-gray-500">
                {selectedAttestation ? selectedAttestation.title : ''}
              </span>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Copy the subject and body below to share the attestation via email. For authenticity,
                ensure the email is sent from a business email domain.
              </p>
            </div>

            {selectedAttestation && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Subject</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-sm bg-gray-50 p-2 rounded flex-grow break-all">
                      {generateAttestationEmailContent(selectedAttestation).subject}
                    </p>
                    <button
                      onClick={() => copyToClipboard(generateAttestationEmailContent(selectedAttestation).subject)}
                      className="ml-2 text-gray-500 hover:text-primary-600 flex-shrink-0"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Body</h3>
                  <div className="flex items-start mt-1">
                    <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap flex-grow font-sans overflow-auto max-h-60">
                      {generateAttestationEmailContent(selectedAttestation).body}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(generateAttestationEmailContent(selectedAttestation).body)}
                      className="ml-2 mt-1 text-gray-500 hover:text-primary-600 flex-shrink-0"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  {copied && (
                    <span className="text-green-600 text-sm">Copied to clipboard!</span>
                  )}
                  <button
                    onClick={() => setEmailModalOpen(false)}
                    className="ml-auto bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
