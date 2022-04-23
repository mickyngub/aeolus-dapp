// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusFactory {
    function getApprovedTokenStablePair(address token) external view returns (address tokenStable);

    function getNumberOfPools() external view returns (uint256);

    function createPair(string memory _tokenSymbolA, string memory _tokenSymbolB) external returns (address pair);

    function createTriple(
        address tokenA,
        address tokenB,
        address tokenC
    ) external returns (address triple);
}
