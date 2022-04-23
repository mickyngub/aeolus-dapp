// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusFactory {
    function getApprovedTokenStablePair(address token) external view returns (address tokenStable);

    function allPoolsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function createTriple(
        address tokenA,
        address tokenB,
        address tokenC
    ) external returns (address triple);
}
