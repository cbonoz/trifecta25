<p align='center'>
  <img src="https://i.ibb.co/SXpVzYXJ/stamp-x.png"/>
</p>

# Singlefact

A Zero-Knowledge Attestation Platform for Privacy-Preserving Document Verification.

Built for Trifecta 2025.

Video demo: https://youtu.be/Z2Tf2YFsfCs

Live Demo Url: https://singlefact.vercel.app (Sepolia)

## Inspiration

We wanted to revolutionize how personal information is verified while maintaining privacy. Common scenarios like:
- Proving minimum bank balance without revealing actual account details
- Verifying age/citizenship without exposing full passport information
- Confirming employment status without sharing sensitive payroll data
- Validating education credentials without revealing full transcripts

These scenarios expose more personal data than necessary, creating security risks. We saw an opportunity to solve this with zero-knowledge proofs and blockchain technology.

## What it does

Singlefact is a decentralized attestation platform that allows organizations to:

- Create and manage ZK attestation programs
- Define specific verification requirements without accessing raw data
- Track and verify attestations on-chain
- Integrate with an AI-powered interface for attestation verification

Users can:
- Submit private data for verification without exposing raw information
- Maintain control over their personal information
- Receive on-chain attestations of verified claims
- Present verified credentials without revealing source documents

## How it Works

### Document Registration and Issuance
1. Organizations upload credential data (e.g., passports, bank statements, educational records)
2. Data is digitally signed by the issuing authority
3. Document hashes and signatures are stored on-chain for verification
4. Original documents remain secure and private

### Zero-Knowledge Proof Generation
Users can selectively prove facts like:
- Age verification from passport without revealing full document
- Account balance minimums without exposing actual amounts
- Educational achievement without sharing full transcripts
- Employment status without revealing salary details

The ZK platform generates compact proofs that:
- Confirm specific facts exist within source documents
- Verify issuing authority signatures
- Validate document authenticity
- Maintain privacy of underlying data

## Business Model

- Usage-based pricing tied to number of attestations
- Enterprise pricing for high-volume credential issuers
- Optional enhanced privacy features for premium users
- API access for third-party integrations

## Technologies used

1. <b>Coinbase Developer Platform</b>
   - AgentKit: Powers the attestation verification experience
   - OnchainKit: Manages attestation state and verification
   - Coinbase SDK: Handles secure wallet connections

2. <b>Base</b>
   - Primary chain for attestation contract deployment
   - Sepolia Contract: https://sepolia.basescan.org/address/0x2412FfB59ce049A5792773dFf493ba8583E5dF50

3. <b>Nethermind</b>
   - ZK-proof generation and verification
   - Smart contract event handling
   - Attestation validation logic

## What's next for Singlefact

- Enhanced Privacy: Implement more ZK-SNARK circuits for complex attestation scenarios
- Government Integration: Partner with regulatory bodies for official document verification
- Cross-chain Attestations: Enable verification across multiple blockchain networks
- Mobile SDK: Native apps for easier attestation submission and verification

### Doing a Singlefact production deployment

1. Update .env with production credentials
2. Deploy ZK verification circuits
3. Update attestation smart contracts on Base
4. Configure AgentKit with production parameters
5. Deploy web interface

Project is open source: https://github.com/cbonoz/trifecta25


### Useful links

* https://ethglobal.com/events/trifecta/prizes#zk-email
*

### Screenshots
