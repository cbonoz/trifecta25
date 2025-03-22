import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { siteConfig } from '@/constant/config';
import SinglefactABI from '@/contracts/Singlefact.json';
import { keccak256, toBytes } from 'viem';

type AttestationDetails = {
  authority: string;
  attestationType: string;
  dataHash: string;
  timestamp: number;
  active: boolean;
};

export function useSinglefact() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const abi = SinglefactABI.abi;

  const { data: attestations, isLoading: loadingAttestations } = useReadContract({
    address: siteConfig.contractAddress as `0x${string}`,
    abi,
    functionName: 'getAuthorityAttestations',
    args: [address],
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: attestationDetails } = useReadContract({
    address: siteConfig.contractAddress as `0x${string}`,
    abi,
    functionName: 'getAttestationDetails',
    args: [attestations?.[0]],
    enabled: Boolean(attestations?.length),
  });

  const generateDocumentHash = async (file: File): Promise<`0x${string}`> => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return keccak256(toBytes(bytes));
  };

  const createAttestation = async ({
    attestationType,
    file,
  }: {
    attestationType: string;
    file: File;
  }) => {
    const dataHash = await generateDocumentHash(file);
    const verification = new Uint8Array([1, 2, 3, 4]);

    return writeContract({
      address: siteConfig.contractAddress as `0x${string}`,
      abi,
      functionName: 'createAttestation',
      args: [attestationType, dataHash, verification],
    });
  };

  const verifyAttestation = async (
    attestationId: string,
    verification: Uint8Array
  ) => {
    return writeContract({
      address: siteConfig.contractAddress as `0x${string}`,
      abi,
      functionName: 'verifyAttestation',
      args: [attestationId, verification],
    });
  };

  return {
    attestations,
    attestationDetails,
    loadingAttestations,
    createAttestation,
    verifyAttestation,
    generateDocumentHash,
  };
}
