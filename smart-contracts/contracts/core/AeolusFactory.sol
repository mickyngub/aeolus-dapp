// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAeolusFactory.sol";
import "./AeolusPair.sol";

contract AeolusFactory is IAeolusFactory, Ownable {
    event PairCreated(string indexed token0, string indexed token1, uint256 id);

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

    function getNumberOfPools() external view returns (uint256 numberOfPools) {
        return pairs.length - 1;
    }

    function getStablePairOfApprovedToken(string memory _symbolApprovedToken) public view returns (StablePair memory stablePair) {
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = approvedTokenIDToStablePairID[approvedTokenID];
        stablePair = stablePairs[stablePairID];
    }

    /**
    ADMIN FUNCTION */

    function addApprovedToken(string memory _symbolApprovedToken, address _address) external onlyOwner {
        require(symbolToApprovedTokenID[_symbolApprovedToken] == 0, "Approved Token Already Exists");
        require(_address != address(0), "Aeolus: ZERO_ADDRESS");
        ApprovedToken memory newApprovedToken = ApprovedToken(_symbolApprovedToken, _address);
        symbolToApprovedTokenID[_symbolApprovedToken] = approvedTokens.length;
        approvedTokens.push(newApprovedToken);
    }

    function addStablePair(string memory _symbolStablePair, address _address) external onlyOwner {
        require(symbolToStablePairID[_symbolStablePair] == 0, "Stable Pair Already Exists");
        require(_address != address(0), "Aeolus: ZERO_ADDRESS");
        StablePair memory newStablePair = StablePair(_symbolStablePair, _address);
        symbolToStablePairID[_symbolStablePair] = stablePairs.length;
        stablePairs.push(newStablePair);
    }

    function linkApprovedTokenToStablePair(string memory _symbolApprovedToken, string memory _symbolStablePair) external onlyOwner {
        require(symbolToApprovedTokenID[_symbolApprovedToken] != 0, "Approved Token DNE");
        require(symbolToStablePairID[_symbolStablePair] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = symbolToStablePairID[_symbolStablePair];

        approvedTokenIDToStablePairID[approvedTokenID] = stablePairID;
    }

    function createPair(string memory _symbolTokenA, string memory _symbolTokenB) external onlyOwner returns (string memory pairName) {
        require(keccak256(abi.encodePacked(_symbolTokenA)) != keccak256(abi.encodePacked(_symbolTokenB)), "Aeolus: IDENTICAL_TOKEN_SYMBOL");
        // Check whether the token has been approved yet
        uint256 approvedTokenAID = symbolToApprovedTokenID[_symbolTokenA];
        uint256 approvedTokenBID = symbolToApprovedTokenID[_symbolTokenB];

        require(approvedTokenAID != 0, "Aeolus: TokenA is not approved");
        require(approvedTokenBID != 0, "Aeolus: TokenB is not approved");

        require(approvedTokenIDToStablePairID[approvedTokenAID] != 0, "Aeolus: TokenA has no stable pair");
        require(approvedTokenIDToStablePairID[approvedTokenBID] != 0, "Aeolus: TokenB has no stable pair");

        pairName = string(abi.encodePacked(_symbolTokenA, "-", _symbolTokenB));

        Pair memory newPair = Pair(pairName, approvedTokens[approvedTokenAID].tokenAddress, approvedTokens[approvedTokenBID].tokenAddress);
        nameToPairID[pairName] = pairs.length;
        pairs.push(newPair);

        emit PairCreated(_symbolTokenA, _symbolTokenB, pairs.length - 1);
    }
}
