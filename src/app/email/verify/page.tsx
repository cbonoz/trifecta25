'use client'

import { useState } from 'react'
import zkeSDK, { Proof } from "@zk-email/sdk"
import { siteConfig } from '@/constant/config';
import { EnvelopeIcon, DocumentCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Started from https://docs.zk.email/zk-email-sdk/setup
export default function VerifyEmail() {
  const [proof, setProof] = useState<Proof | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true);
    setError(null);
    setProof(null);
    setVerification(null);

    try {
      const eml = await file.text()
      const sdk = zkeSDK()
      const blueprint = await sdk.getBlueprint(siteConfig.zkBlueprint);
      const prover = blueprint.createProver()
      const newProof = await prover.generateProof(eml);
      setProof(newProof);

      const verificationResult = await blueprint.verifyProofOnChain(newProof);
      setVerification(verificationResult);
    } catch (error: any) {
      setError(error.message || "Error generating proof");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-2 text-gray-600">
            Verify email authenticity of attestations generated on {siteConfig.title} using zero-knowledge proofs
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Email File (.eml)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".eml"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">EML file up to 10MB</p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Generating proof...</p>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {proof && (
              <div className="rounded-md bg-green-50 p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">Proof Generated Successfully</h3>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <pre className="text-xs overflow-auto max-h-48">
                    {JSON.stringify(proof, null, 2)}
                  </pre>
                </div>
                {verification && (
                  <div className="mt-3 text-sm text-green-700">
                    Verification Status: {JSON.stringify(verification)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
