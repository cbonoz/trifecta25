import { siteConfig } from '@/constant/config';
import { SinglefactAbi } from '@/contracts/Singlefact';
import { ethers } from 'ethers';
import { keccak256, toBytes } from 'viem';
import { Attestation } from './types';

const ABI = SinglefactAbi;

export const generateAttestationId = (
  address: string,
  title: string,
  documentHash: string,
  timestamp: number
): string => {
  return keccak256(
    toBytes(
      ethers.solidityPacked(
        ['address', 'string', 'bytes32', 'uint256'],
        [address, title, documentHash, timestamp]
      )
    )
  );
};

export const generateDocumentHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return keccak256(toBytes(bytes as any));
};

export const createAttestation = async (
  signer: any,
  params: {
    title: string;
    description: string;
    file: File;
    statement: string;
    proof: string;
  }
) => {
  const contract = new ethers.Contract(siteConfig.contractAddress, SinglefactAbi, signer);
  const documentHash = await generateDocumentHash(params.file);
  const timestamp = Math.floor(Date.now() / 1000);
  const attestationId = generateAttestationId(
    await signer.getAddress(),
    params.title,
    documentHash,
    timestamp
  );

  const tx = await contract.createAttestation(
    attestationId,
    params.title,
    params.description,
    documentHash,
    params.statement,
    params.proof
  );
  await tx.wait();
  return attestationId;
};

export const getAttestations = async (signer: any): Promise<Attestation[]> => {
  const contract = new ethers.Contract(siteConfig.contractAddress, SinglefactAbi, signer);
  const attestations = await contract.getMyAttestations();
  return attestations.map((a: any) => ({
    id: a.id,
    owner: a.owner,
    title: a.title,
    description: a.description,
    documentHash: a.documentHash,
    statement: a.statement,
    proof: a.proof,
    active: a.active,
    timestamp: Number(a.timestamp)
  }));
};

export const getAttestationDetails = async (signer: any, attestationId: string): Promise<Attestation> => {
  const contract = new ethers.Contract(siteConfig.contractAddress, SinglefactAbi, signer);
  const details = await contract.getAttestationDetails(attestationId);
  return {
    id: attestationId,
    owner: details.owner,
    title: details.title,
    description: details.description,
    documentHash: details.documentHash,
    statement: details.statement,
    proof: details.proof,
    active: details.active,
    timestamp: Number(details.timestamp)
  };
};

export const getMyAttestations = async (signer: any): Promise<Attestation[]> => {
  const contract = new ethers.Contract(siteConfig.contractAddress, SinglefactAbi, signer);
  try {
    const attestations = await contract.getMyAttestations();
    return attestations.map((a: any) => ({
      id: a.id,
      owner: a.owner,
      title: a.title,
      description: a.description,
      documentHash: a.documentHash,
      statement: a.statement,
      proof: a.proof,
      active: a.active,
      timestamp: Number(a.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching attestations:', error);
    return [];
  }
};

export const validateAttestation = async (
  signer: any,
  attestationId: string,
  proof: string
): Promise<boolean> => {
  const contract = new ethers.Contract(siteConfig.contractAddress, SinglefactAbi, signer);
  try {
    // Changed from a view call to a transaction
    const tx = await contract.validateProof(attestationId, proof);
    const receipt = await tx.wait();

    // Try to find the event in the logs
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed?.name === "ProofVerified") {
          return parsed.args.isValid;
        }
      } catch (e) {
        // Skip logs that can't be parsed
        continue;
      }
    }

    // Default to true if we made it here (transaction succeeded but event not found)
    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};
