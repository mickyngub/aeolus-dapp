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
    mapping(address => address) public addressApprovedTokenToAddressStablePair;

    struct Pair {
        string name;
        address token0;
        address token1;
        address aeolusPairAddress;
    }
    Pair[] public pairs;
    mapping(string => uint256) public nameToPairID;

    constructor() {
        // Make the array starts from index 1 since mapping will always return 0 if DNE
        approvedTokens.push(ApprovedToken("BaseApprovedToken", address(0)));
        stablePairs.push(StablePair("BaseStablePair", address(0)));
        pairs.push(Pair("BasePair", address(0), address(0), address(0)));
    }

    function getPair(uint256 poolID)
        public
        view
        returns (
            string memory name,
            address tokenA,
            address tokenB,
            address aeolusPairAddress
        )
    {
        return (pairs[poolID].name, pairs[poolID].token0, pairs[poolID].token1, pairs[poolID].aeolusPairAddress);
    }

    function getNumberOfPools() external view returns (uint256 numberOfPools) {
        return pairs.length - 1;
    }

    function getNumberOfApprovedTokens() external view returns (uint256 numberOfApprovedTokens) {
        return approvedTokens.length - 1;
    }

    function getNumberOfStablePairs() external view returns (uint256 numberOfStablePairs) {
        return stablePairs.length - 1;
    }

    function getStablePairOfApprovedToken(string memory _symbolApprovedToken) public view returns (string memory stableSymbol, address stableAddress) {
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = approvedTokenIDToStablePairID[approvedTokenID];
        StablePair memory stablePair = stablePairs[stablePairID];
        return (stablePair.stableSymbol, stablePair.stableAddress);
    }

    function getStableAddressOfApprovedToken(address approvedToken) public view returns (address stableAddress) {
        return addressApprovedTokenToAddressStablePair[approvedToken];
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

    function linkOrUpdateApprovedTokenToStablePair(string memory _symbolApprovedToken, string memory _symbolStablePair) external onlyOwner {
        require(symbolToApprovedTokenID[_symbolApprovedToken] != 0, "Approved Token DNE");
        require(symbolToStablePairID[_symbolStablePair] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stablePairID = symbolToStablePairID[_symbolStablePair];

        ApprovedToken memory approvedToken = approvedTokens[approvedTokenID];
        StablePair memory stablePair = stablePairs[stablePairID];

        addressApprovedTokenToAddressStablePair[approvedToken.tokenAddress] = stablePair.stableAddress;
        approvedTokenIDToStablePairID[approvedTokenID] = stablePairID;
    }

    function createPair(string memory _symbolTokenA, string memory _symbolTokenB) external onlyOwner returns (AeolusPair newAeolusPair) {
        require(keccak256(abi.encodePacked(_symbolTokenA)) != keccak256(abi.encodePacked(_symbolTokenB)), "Aeolus: IDENTICAL_TOKEN_SYMBOL");
        // Check whether the token has been approved yet
        uint256 approvedTokenAID = symbolToApprovedTokenID[_symbolTokenA];
        uint256 approvedTokenBID = symbolToApprovedTokenID[_symbolTokenB];

        require(approvedTokenAID != 0, "Aeolus: TokenA is not approved");
        require(approvedTokenBID != 0, "Aeolus: TokenB is not approved");

        address approvedTokenAAddress = approvedTokens[approvedTokenAID].tokenAddress;
        address approvedTokenBAddress = approvedTokens[approvedTokenBID].tokenAddress;

        StablePair memory stablePairOfA = stablePairs[(approvedTokenIDToStablePairID[approvedTokenAID])];
        StablePair memory stablePairOfB = stablePairs[(approvedTokenIDToStablePairID[approvedTokenBID])];

        require(approvedTokenIDToStablePairID[approvedTokenAID] != 0, "Aeolus: TokenA has no stable pair");
        require(approvedTokenIDToStablePairID[approvedTokenBID] != 0, "Aeolus: TokenB has no stable pair");

        address addressOftablePairOfA = stablePairOfA.stableAddress;
        address addresOfStablePairOfB = stablePairOfB.stableAddress;

        newAeolusPair = new AeolusPair();
        newAeolusPair.initialize(approvedTokenAAddress, approvedTokenBAddress, addressOftablePairOfA, addresOfStablePairOfB);

        string memory pairName = string(abi.encodePacked(_symbolTokenA, "-", _symbolTokenB));

        Pair memory newPair = Pair(
            pairName,
            approvedTokens[approvedTokenAID].tokenAddress,
            approvedTokens[approvedTokenBID].tokenAddress,
            address(newAeolusPair)
        );
        nameToPairID[pairName] = pairs.length;
        pairs.push(newPair);

        emit PairCreated(_symbolTokenA, _symbolTokenB, pairs.length - 1);
    }
}
