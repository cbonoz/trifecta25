

SingleFact
---

For businesses that issue credentials, enable third parties to validate information from you while disclosing the minimal amount of information.

Verify a single fact within a data source without exposing the entire dataset.

* Have to submit the entirety

###

Use ZkProofs and

1. Digital Passport Registration (Issuance Process)
When a passport is issued by a government authority, the relevant details of the passport (e.g., passport number, expiration date, holder's name, nationality) are digitally signed by the issuing authority (e.g., government agency or passport office). These details are stored in a secure, trusted platform (e.g., blockchain, or a centralized secure database controlled by the issuing authority). This digital signature acts as a proof of authenticity for the passport.

The hash of the passport details (along with the digital signature) is stored on a blockchain or trusted ledger. This ensures that the passport's information is immutable and verifiable later.

2. Generating a Zero-Knowledge Proof (ZKP) for Passport Validation
When a person needs to prove that their passport is valid without revealing the actual document, the ZKP platform comes into play. Here's how it works:

The passport holder (user) selects the specific pieces of information they want to prove, such as:

Passport number
Date of birth
Expiration date
Nationality
Using a ZKP scheme (such as zk-SNARKs or zk-STARKs), the passport holder creates a proof that:

The selected information is contained within the passport.
The passport has been signed by the issuing authority and is thus authentic.
The passport is still valid (e.g., not expired).
The proof is generated on the ZKP platform without actually revealing any of the sensitive passport details. The result is a compact, privacy-preserving proof that can be shared with a verifier.



### Business model

Number of uploaded records.


### Sponsors used

* ZK Email: Verify an email comes from an authorized app user
* Aleo: Create a private dapp as the backing of the contract

* SP1: https://docs.succinct.xyz/
Qualification Requirements
✅ Integrate SP1, Succinct's zero knowledge virtual machine in your application
✅ Implement a use case where ZK and verifiability creates a unique user experience
✅ Include in your ETHGlobal writeup how ZK was used in your application
