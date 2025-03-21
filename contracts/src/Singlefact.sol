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

    struct Authority {
        string name;
        string[] attestationTypes;
        bool active;
    }

    mapping(address => Authority) public authorities;
    mapping(bytes32 => Attestation) public attestations;
    mapping(address => mapping(string => uint256)) public attestationCounts;
    mapping(address => bytes32[]) public authorityAttestations;

    event AuthorityRegistered(address indexed authority, string name);
    event AttestationCreated(bytes32 indexed id, address indexed authority, string attestationType);
    event AttestationVerified(bytes32 indexed id, address indexed verifier);
    event AuthorityDeactivated(address indexed authority);

    modifier onlyAuthority() {
        require(authorities[msg.sender].active, "Not an active authority");
        _;
    }

    function registerAuthority(string memory name, string[] memory attestationTypes) external {
        require(!authorities[msg.sender].active, "Already registered");
        authorities[msg.sender] = Authority({
            name: name,
            attestationTypes: attestationTypes,
            active: true
        });
        emit AuthorityRegistered(msg.sender, name);
    }

    function createAttestation(
        string memory attestationType,
        bytes32 dataHash,
        bytes calldata verification // Simplified verification data
    ) external onlyAuthority returns (bytes32) {
        require(isValidAttestationType(msg.sender, attestationType), "Invalid attestation type");

        // Simplified verification - just check that some data was provided
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

        // Simplified verification - just check that data matches
        return verification.length > 0;
    }

    function isValidAttestationType(address authority, string memory attestationType)
        internal view returns (bool)
    {
        string[] memory types = authorities[authority].attestationTypes;
        for (uint i = 0; i < types.length; i++) {
            if (keccak256(bytes(types[i])) == keccak256(bytes(attestationType))) {
                return true;
            }
        }
        return false;
    }

    function getAuthorityAttestations(address authority)
        external view returns (bytes32[] memory)
    {
        return authorityAttestations[authority];
    }

    function deactivateAuthority() external onlyAuthority {
        authorities[msg.sender].active = false;
        emit AuthorityDeactivated(msg.sender);
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
