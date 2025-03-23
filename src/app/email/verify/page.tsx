"use client";

import VerifyEmail from "@/components/verify-email";
import { siteConfig } from "@/constant/config";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function VerifyEmailPage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Email Verification
          </h1>
          <p className="mt-2 text-gray-600">
            Verify the email authenticity on {siteConfig.title} using zero-knowledge proofs.
          </p>
        </div>
      </div>
      <VerifyEmail />
    </div>
  );
}
