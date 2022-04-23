// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "./interfaces/IAeolusFactory.sol";
import "./AeolusPair.sol";

contract AeolusFactory is IAeolusFactory {
    event PairCreated(address indexed token0, address indexed token1, uint256 id);

    struct ApprovedToken {
        string tokenName;
        address tokenAddress;
    }

    ApprovedToken[] public approvedTokens;
    mapping(string => uint256) public nameToApprovedTokenID;

    struct StablePair {
        string stableName;
        address stableAddress;
    }

    StablePair[] public stablePairs;
    mapping(string => uint256) public nameToStablePairID;

    mapping(uint256 => uint256) public approvedTokenIDToStablePairID;

    struct Pair {
        uint256 id;
        string name;
        address token0;
        address token1;
    }
    Pair[] public pairs;
    mapping(string => uint256) public nameToPairID;

    function createPair(
        string memory _name,
        address tokenA,
        address tokenB
    ) external {
        require(tokenA != tokenB, "Aeolus: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "Aeolus: ZERO_ADDRESS");

        // AeolusPair(pair).initialize(token0, token1);

        Pair memory newPair = Pair(pairs.length, _name, tokenA, tokenB);
        pairs.push(newPair);
        nameToIDPair[_name] = pairs.length;
        emit PairCreated(token0, token1, pairs.length);
    }
}
