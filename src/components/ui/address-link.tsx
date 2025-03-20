import { abbreviateAddress, getExplorerUrl } from '@/lib/utils';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface AddressLinkProps {
  address: string;
  chars?: number;
  className?: string;
}

export function AddressLink({ address, chars = 4, className = '' }: AddressLinkProps) {
  return (
    <a
      href={getExplorerUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 hover:text-primary-600 transition-colors ${className}`}
    >
      {abbreviateAddress(address, chars)}
      <FaExternalLinkAlt className="w-3 h-3" />
    </a>
  );
}
