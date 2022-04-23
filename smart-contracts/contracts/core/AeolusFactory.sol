// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "./interfaces/IAeolusFactory.sol";
import "./AeolusPair.sol";

contract AeolusFactory is IAeolusFactory {
    event PairCreated(address indexed token0, address indexed token1, uint256 id);

    struct ApprovedToken {
        string tokenSymbol;
        address tokenAddress;
    }

    ApprovedToken[] public approvedTokens;

    mapping(string => uint256) public symbolToApprovedTokenID;

    struct StablePair {
        string stableSymbol;
        address stableAddress;
    }

    StablePair[] public stablePairs;
    mapping(string => uint256) public symbolToStablePairID;

    mapping(uint256 => uint256) public approvedTokenIDToStablePairID;

    struct Pair {
        string name;
        address token0;
        address token1;
    }
    Pair[] public pairs;
    mapping(string => uint256) public nameToPairID;

    constructor() {
        // Make the array starts from index 1 since mapping will always return 0 if DNE
        approvedTokens.push(ApprovedToken("BaseApprovedToken", address(0)));
        stablePairs.push(StablePair("BaseStablePair", address(0)));
        pairs.push(Pair("BasePair", address(0), address(0)));
    }

    function addApprovedToken(string memory _approvedTokenSymbol, address _address) external {
        require(symbolToApprovedTokenID[_approvedTokenSymbol] == 0, "Approved Token Already Exists");
        ApprovedToken memory newApprovedToken = ApprovedToken(_approvedTokenSymbol, _address);
        symbolToApprovedTokenID[_approvedTokenSymbol] = approvedTokens.length;
        approvedTokens.push(newApprovedToken);
    }

    function addStablePair(string memory _stablePairSymbol, address _address) external {
        require(symbolToStablePairID[_stablePairSymbol] == 0, "Stable Pair Already Exists");
        StablePair memory newStablePair = StablePair(_stablePairSymbol, _address);
        symbolToStablePairID[_stablePairSymbol] = stablePairs.length;
        stablePairs.push(newStablePair);
    }

    function linkApprovedTokenToStablePair(string memory _symbolApprovedToken, string memory _symbolStablePair) external {
        require(symbolToApprovedTokenID[_symbolApprovedToken] != 0, "Approved Token DNE");
        require(symbolToStablePairID[_symbolStablePair] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = symbolToStablePairID[_symbolStablePair];

        approvedTokenIDToStablePairID[approvedTokenID] = stablePairID;
    }

    function createPair(address tokenA, address tokenB) external {
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
