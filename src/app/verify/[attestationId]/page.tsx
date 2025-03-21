import VerifyPageContent from '@/components/verify-page-content';
import { Suspense } from 'react';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
