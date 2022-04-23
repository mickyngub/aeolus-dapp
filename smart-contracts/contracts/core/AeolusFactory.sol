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

    function addApprovedToken(string memory _name, address _address) external {
        require(nameToApprovedTokenID[_name] == 0, "Approved Token Already Exists");
        ApprovedToken memory newApprovedToken = ApprovedToken(_name, _address);
        nameToApprovedTokenID[_name] = approvedTokens.length;
        approvedTokens.push(newApprovedToken);
    }

    function addStablePair(string memory _name, address _address) external {
        require(nameToStablePairID[_name] == 0, "Stable Pair Already Exists");
        StablePair memory newStablePair = StablePair(_name, _address);
        nameToStablePairID[_name] = stablePairs.length;
        stablePairs.push(newStablePair);
    }

    function linkApprovedTokenToStablePair(string memory _nameApprovedToken, string memory _nameStablePair) external {
        require(nameToApprovedTokenID[_nameApprovedToken] != 0, "Approved Token DNE");
        require(nameToStablePairID[_nameStablePair] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = nameToApprovedTokenID[_nameApprovedToken];
        uint256 stablePairID = nameToStablePairID[_nameStablePair];

        approvedTokenIDToStablePairID[approvedTokenID] = stablePairID;
    }

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
