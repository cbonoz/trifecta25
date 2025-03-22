// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Singlefact {
    struct Attestation {
        bytes32 id;
        address authority;
        string attestationType;
        bytes32 dataHash;
        uint256 timestamp;
        bool active;
    }

    mapping(bytes32 => Attestation) public attestations;
    mapping(address => mapping(string => uint256)) public attestationCounts;
    mapping(address => bytes32[]) public authorityAttestations;

    event AttestationCreated(bytes32 indexed id, address indexed authority, string attestationType);
    event AttestationVerified(bytes32 indexed id, address indexed verifier);
    event AttestationDeactivated(bytes32 indexed id);

    function createAttestation(
        string memory attestationType,
        bytes32 dataHash,
        bytes calldata verification
    ) external returns (bytes32) {
        require(verification.length > 0, "Verification data required");

        bytes32 attestationId = keccak256(abi.encodePacked(
            msg.sender,
            attestationType,
            dataHash,
            block.timestamp
        ));

        attestations[attestationId] = Attestation({
            id: attestationId,
            authority: msg.sender,
            attestationType: attestationType,
            dataHash: dataHash,
            timestamp: block.timestamp,
            active: true
        });

        authorityAttestations[msg.sender].push(attestationId);
        attestationCounts[msg.sender][attestationType]++;

        emit AttestationCreated(attestationId, msg.sender, attestationType);
        return attestationId;
    }

    function verifyAttestation(
        bytes32 attestationId,
        bytes calldata verification
    ) external view returns (bool) {
        Attestation memory attestation = attestations[attestationId];
        require(attestation.active, "Attestation not active");
        // TODO: Implement actual verification logic based on the verification data
        return verification.length > 0;
    }

    function deactivateAttestation(bytes32 attestationId) external {
        Attestation storage attestation = attestations[attestationId];
        require(attestation.authority == msg.sender, "Not attestation authority");
        require(attestation.active, "Already deactivated");

        attestation.active = false;
        emit AttestationDeactivated(attestationId);
    }

    function getAuthorityAttestations(address authority)
        external view returns (bytes32[] memory)
    {
        return authorityAttestations[authority];
    }

    function getAttestationDetails(bytes32 attestationId)
        external view returns (
            address authority,
            string memory attestationType,
            bytes32 dataHash,
            uint256 timestamp,
            bool active
        )
    {
        Attestation memory attestation = attestations[attestationId];
        return (
            attestation.authority,
            attestation.attestationType,
            attestation.dataHash,
            attestation.timestamp,
            attestation.active
        );
    }
}
