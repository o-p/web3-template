// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

contract Dev {
    address payable public owner;

    // @custom:storage-location erc7201:o-p.dev
    struct DevStorage {
        uint256 _nonce;
    }

    // keccak256(abi.encode(uint256(keccak256("o-p.dev")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant STORAGE_LOC =
        0xa271e4d70da084cff0347348fcf177546cc0002dfe43a589d0b6b4b6d3477b00;

    function _getDevStorage() private pure returns (DevStorage storage $) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            $.slot := STORAGE_LOC
        }
    }

    constructor() {
        owner = payable(msg.sender);
        _getDevStorage()._nonce = block.timestamp;
    }

    function getNonce() public view returns (uint256) {
        return _getDevStorage()._nonce;
    }

    function erc7201(string memory id) public pure returns (bytes32) {
        // From https://eips.ethereum.org/EIPS/eip-7201
        return keccak256(abi.encode(uint256(keccak256(bytes(id))) - 1)) & ~bytes32(uint256(0xff));
    }
}
