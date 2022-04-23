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

    function addApprovedToken(string memory _approvedTokenSymbol, address _address) external onlyOwner {
        require(symbolToApprovedTokenID[_approvedTokenSymbol] == 0, "Approved Token Already Exists");
        require(_address != address(0), "Aeolus: ZERO_ADDRESS");
        ApprovedToken memory newApprovedToken = ApprovedToken(_approvedTokenSymbol, _address);
        symbolToApprovedTokenID[_approvedTokenSymbol] = approvedTokens.length;
        approvedTokens.push(newApprovedToken);
    }

    function addStablePair(string memory _stablePairSymbol, address _address) external onlyOwner {
        require(symbolToStablePairID[_stablePairSymbol] == 0, "Stable Pair Already Exists");
        require(_address != address(0), "Aeolus: ZERO_ADDRESS");
        StablePair memory newStablePair = StablePair(_stablePairSymbol, _address);
        symbolToStablePairID[_stablePairSymbol] = stablePairs.length;
        stablePairs.push(newStablePair);
    }

    function linkApprovedTokenToStablePair(string memory _symbolApprovedToken, string memory _symbolStablePair) external onlyOwner {
        require(symbolToApprovedTokenID[_symbolApprovedToken] != 0, "Approved Token DNE");
        require(symbolToStablePairID[_symbolStablePair] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = symbolToStablePairID[_symbolStablePair];

        approvedTokenIDToStablePairID[approvedTokenID] = stablePairID;
    }

    function createPair(string memory _tokenSymbolA, string memory _tokenSymbolB) external onlyOwner {
        require(keccak256(abi.encodePacked(_tokenSymbolA)) != keccak256(abi.encodePacked(_tokenSymbolB)), "Aeolus: IDENTICAL_TOKEN_SYMBOL");
        // Check whether the token has been approved yet
        uint256 approvedTokenAID = symbolToApprovedTokenID[_tokenSymbolA];
        uint256 approvedTokenBID = symbolToApprovedTokenID[_tokenSymbolB];

        require(approvedTokenAID != 0, "Aeolus: TokenA is not approved");
        require(approvedTokenBID != 0, "Aeolus: TokenB is not approved");

        require(approvedTokenIDToStablePairID[approvedTokenAID] != 0, "Aeolus: TokenA has no stable pair");
        require(approvedTokenIDToStablePairID[approvedTokenBID] != 0, "Aeolus: TokenB has no stable pair");

        string memory pairName = string(abi.encodePacked(_tokenSymbolA, "-", _tokenSymbolB));

        Pair memory newPair = Pair(pairName, approvedTokens[approvedTokenAID].tokenAddress, approvedTokens[approvedTokenBID].tokenAddress);
        nameToPairID[pairName] = pairs.length;
        pairs.push(newPair);

        emit PairCreated(_tokenSymbolA, _tokenSymbolB, pairs.length - 1);
    }
}
