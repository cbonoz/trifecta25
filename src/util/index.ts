import { siteConfig } from '@/constant/config';
import { Attestation } from '@/lib/types';

export const requireEnv = (value: any, key: string): string => {
  if (!value) {
    throw new Error('Env var ' + key + ' is required');
  }

  return value as string
}


export const generateEmail = (link: string): string => {
  return `<html>
  <body>
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${link}">${link}</a>
  </body>
</html>`
}

export const generateAttestationEmail = (attestation: any, verifyUrl: string): string => {
  return `
Subject: [${siteConfig.title}] Data verification: ${attestation.title}

Hello,

I'd like to share an attestation with you that requires verification:

Title: ${attestation.title}
Attestation ID: ${attestation.id}

To verify this attestation, please visit:
${verifyUrl}

You'll need the following proof code during verification:
${attestation.proof}

Thank you,
  `;
// ${attestation.owner}
}

export const generateAttestationEmailContent = (
  attestation: Attestation
): { subject: string; body: string } => {
  if (!attestation) return { subject: '', body: '' };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const verifyUrl = `${baseUrl}/verify/${attestation.id}`;

  // Format owner address for better readability
  const formattedOwner = attestation.owner.length > 10
    ? `${attestation.owner.substring(0, 6)}...${attestation.owner.substring(attestation.owner.length - 4)}`
    : attestation.owner;

  return {
    subject: `[${siteConfig.title}] Data verification: ${attestation.title}`,
    body: `Hello,

I'd like to share an attestation with you that requires verification:

Title: ${attestation.title}
Attestation ID: ${attestation.id}

To verify this attestation, please visit:
${verifyUrl}

You'll need the following proof code during verification:
${attestation.proof}

Thank you,`
  };
// ${formattedOwner}`
};

export const openEmailClient = (attestation: any, baseUrl: string) => {
  const verifyUrl = `${baseUrl}/verify/${encodeURIComponent(attestation.id)}`;

  const emailSubject = `Verification Request: ${attestation.title}`;
  const emailBody = `
Hello,

I'd like to share an attestation with you that requires verification:

Title: ${attestation.title}
Attestation ID: ${attestation.id}

To verify this attestation, please visit:
${verifyUrl}

You'll need the following proof code during verification:
${attestation.proof}

Thank you,
  `;

  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  window.open(mailtoLink, '_blank');
};
