// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    event TripleCreated(address indexed token0, address indexed token1, address indexed token2, address triple, uint256);

    function getPair(address tokenA, address tokenB) external view returns (address pair);

    function getTriple(
        address tokenA,
        address tokenB,
        address tokenC
    ) external view returns (address pair);

    function getTokenStable(address token) external view returns (address tokenStable);

    function allPairs(uint256) external view returns (address pair);

    function allTriples(uint256) external view returns (address triple);

    function allPairsLength() external view returns (uint256);

    function allTriplesLength() external view returns (uint256);

    function allPoolsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function createTriple(
        address tokenA,
        address tokenB,
        address tokenC
    ) external returns (address triple);
}
