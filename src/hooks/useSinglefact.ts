import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { siteConfig } from '@/constant/config';
import SinglefactABI from '@/contracts/Singlefact.json';

export function useSinglefact() {
  const { address } = useAccount();

  const { data: attestations, isLoading: loadingAttestations } = useContractRead({
    address: siteConfig.contractAddress as `0x${string}`,
    abi: SinglefactABI,
    functionName: 'getAuthorityAttestations',
    args: [address],
    enabled: !!address,
  });

  const { writeAsync: createAttestation } = useContractWrite({
    address: siteConfig.contractAddress as `0x${string}`,
    abi: SinglefactABI,
    functionName: 'createAttestation',
  });

  const { writeAsync: registerAuthority } = useContractWrite({
    address: siteConfig.contractAddress as `0x${string}`,
    abi: SinglefactABI,
    functionName: 'registerAuthority',
  });

  return {
    attestations,
    loadingAttestations,
    createAttestation,
    registerAuthority,
  };
}
