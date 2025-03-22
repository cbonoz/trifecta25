// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Singlefact {
    struct Attestation {
        bytes32 id;
        address owner;
        string title;
        string description;
        bytes32 documentHash;
        string statement;
        bool active;
        uint256 timestamp;
        string proof;       // Base64 encoded ZK proof
    }

    mapping(bytes32 => Attestation) public attestations;
    mapping(address => bytes32[]) public ownerAttestations;

    event AttestationCreated(
        bytes32 indexed id,
        address indexed owner,
        string title,
        string description,
        bytes32 documentHash,
        string statement
    );
    event AttestationDeactivated(bytes32 indexed id);
    event ProofValidated(bytes32 indexed attestationId, address indexed verifier, bool isValid);

    function createAttestation(
        bytes32 attestationId,  // Pre-generated unique hash
        string memory title,
        string memory description,
        bytes32 documentHash,
        string memory statement,
        string memory proof
    ) external returns (bool) {
        require(attestations[attestationId].timestamp == 0, "Attestation ID already exists");

        attestations[attestationId] = Attestation({
            id: attestationId,
            owner: msg.sender,
            title: title,
            description: description,
            documentHash: documentHash,
            statement: statement,
            proof: proof,
            active: true,
            timestamp: block.timestamp
        });

        ownerAttestations[msg.sender].push(attestationId);
        emit AttestationCreated(attestationId, msg.sender, title, description, documentHash, statement);
        return true;
    }

    function getMyAttestations() external view returns (Attestation[] memory) {
        bytes32[] memory ids = ownerAttestations[msg.sender];
        Attestation[] memory result = new Attestation[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            result[i] = attestations[ids[i]];
        }

        return result;
    }

    function deactivateAttestation(bytes32 attestationId) external {
        Attestation storage attestation = attestations[attestationId];
        require(attestation.owner == msg.sender, "Not attestation owner");
        require(attestation.active, "Already deactivated");

        attestation.active = false;
        emit AttestationDeactivated(attestationId);
    }

    function getAttestationDetails(bytes32 attestationId)
        external view returns (
            string memory title,
            string memory description,
            address owner,
            bytes32 documentHash,
            string memory statement,
            string memory proof,
            bool active,
            uint256 timestamp
        )
    {
        Attestation memory attestation = attestations[attestationId];
        return (
            attestation.title,
            attestation.description,
            attestation.owner,
            attestation.documentHash,
            attestation.statement,
            attestation.proof,
            attestation.active,
            attestation.timestamp
        );
    }

    function validateProof(bytes32 attestationId, string memory providedProof)
        external
        view
        returns (bool)
    {
        Attestation memory attestation = attestations[attestationId];
        require(attestation.active, "Attestation not active");

        // Compare proof hashes instead of raw strings for gas efficiency
        bytes32 storedHash = keccak256(abi.encodePacked(attestation.proof));
        bytes32 providedHash = keccak256(abi.encodePacked(providedProof));

        return storedHash == providedHash;
    }
}
