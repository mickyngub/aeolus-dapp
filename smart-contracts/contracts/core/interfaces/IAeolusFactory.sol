// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusFactory {
    function getNumberOfPools() external view returns (uint256);

    function createPair(string memory _tokenSymbolA, string memory _tokenSymbolB) external returns (string memory pairName);

    // function createTriple(
    //     address tokenA,
    //     address tokenB,
    //     address tokenC
    // ) external returns (address triple);
}
