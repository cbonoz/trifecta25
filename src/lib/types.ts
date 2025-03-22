export interface Attestation {
  id: string;
  owner: string;
  title: string;
  description: string;
  documentHash: string;
  statement: string;
  active: boolean;
  timestamp: number;
  proof: string;    // Base64 encoded ZK proof
}
