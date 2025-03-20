import AttestationPageContent from '@/components/attestation-page-content';
import { Suspense } from 'react';

export default function AttestationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttestationPageContent />
    </Suspense>
  );
}
