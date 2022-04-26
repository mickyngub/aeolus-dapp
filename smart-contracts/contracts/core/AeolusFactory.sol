// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

/**
 * @title AeolusFactory
 * @author Pichaya Puttekulangkura
 * @custom:experimental This is an experimental contract.
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IAeolusFactory.sol";
import "./AeolusPair.sol";

contract AeolusFactory is IAeolusFactory, Ownable {
    event PairCreated(string indexed pairSymbol, uint256 id);

    struct ApprovedToken {
        string tokenSymbol;
        address tokenAddress;
    }

    ApprovedToken[] public approvedTokens;

    mapping(string => uint256) public symbolToApprovedTokenID;

    struct StableToken {
        string stableSymbol;
        address stableAddress;
    }

    StableToken[] public stableTokens;
    mapping(string => uint256) public symbolToStableTokenID;

    mapping(uint256 => uint256) public approvedTokenIDToStableTokenID;
    mapping(address => address) public addressApprovedTokenToAddressStableToken;

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
        stableTokens.push(StableToken("BaseStableToken", address(0)));
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

    function getNumberOfStableTokens() external view returns (uint256 numberOfStableTokens) {
        return stableTokens.length - 1;
    }

    function getStableTokenOfApprovedToken(string memory _symbolApprovedToken) public view returns (string memory stableSymbol, address stableAddress) {
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stableTokenID = approvedTokenIDToStableTokenID[approvedTokenID];
        StableToken memory stableToken = stableTokens[stableTokenID];
        return (stableToken.stableSymbol, stableToken.stableAddress);
    }

    function getStableAddressOfApprovedToken(address approvedToken) public view returns (address stableAddress) {
        return addressApprovedTokenToAddressStableToken[approvedToken];
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

    function addStableToken(string memory _symbolStableToken, address _address) external onlyOwner {
        require(symbolToStableTokenID[_symbolStableToken] == 0, "Stable Pair Already Exists");
        require(_address != address(0), "Aeolus: ZERO_ADDRESS");
        StableToken memory newStableToken = StableToken(_symbolStableToken, _address);
        symbolToStableTokenID[_symbolStableToken] = stableTokens.length;
        stableTokens.push(newStableToken);
    }

    function linkOrUpdateApprovedTokenToStableToken(string memory _symbolApprovedToken, string memory _symbolStableToken) external onlyOwner {
        require(symbolToApprovedTokenID[_symbolApprovedToken] != 0, "Approved Token DNE");
        require(symbolToStableTokenID[_symbolStableToken] != 0, "Stable Pair DNE");
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stableTokenID = symbolToStableTokenID[_symbolStableToken];

        ApprovedToken memory approvedToken = approvedTokens[approvedTokenID];
        StableToken memory stableToken = stableTokens[stableTokenID];

        addressApprovedTokenToAddressStableToken[approvedToken.tokenAddress] = stableToken.stableAddress;
        approvedTokenIDToStableTokenID[approvedTokenID] = stableTokenID;
    }

    function createPair(
        string memory _symbolTokenA,
        string memory _symbolTokenB,
        address _aeolusRouter
    ) external onlyOwner returns (AeolusPair newAeolusPair) {
        require(keccak256(abi.encodePacked(_symbolTokenA)) != keccak256(abi.encodePacked(_symbolTokenB)), "Aeolus: IDENTICAL_TOKEN_SYMBOL");
        // Check whether the token has been approved yet
        uint256 approvedTokenAID = symbolToApprovedTokenID[_symbolTokenA];
        uint256 approvedTokenBID = symbolToApprovedTokenID[_symbolTokenB];

        require(approvedTokenAID != 0, "Aeolus: TokenA is not approved");
        require(approvedTokenBID != 0, "Aeolus: TokenB is not approved");

        address approvedTokenAAddress = approvedTokens[approvedTokenAID].tokenAddress;
        address approvedTokenBAddress = approvedTokens[approvedTokenBID].tokenAddress;

        StableToken memory stableTokenOfA = stableTokens[(approvedTokenIDToStableTokenID[approvedTokenAID])];
        StableToken memory stableTokenOfB = stableTokens[(approvedTokenIDToStableTokenID[approvedTokenBID])];

        require(approvedTokenIDToStableTokenID[approvedTokenAID] != 0, "Aeolus: TokenA has no stable pair");
        require(approvedTokenIDToStableTokenID[approvedTokenBID] != 0, "Aeolus: TokenB has no stable pair");

        address addressOftablePairOfA = stableTokenOfA.stableAddress;
        address addresOfStableTokenOfB = stableTokenOfB.stableAddress;

        uint256 pairID = pairs.length;
        string memory pairName = string(abi.encodePacked(Strings.toString(pairID), "-AEOLUS"));
        string memory pairSymbol = string(abi.encodePacked(_symbolTokenA, "-", _symbolTokenB));

        newAeolusPair = new AeolusPair(_aeolusRouter, pairName, pairSymbol);
        newAeolusPair.initialize(approvedTokenAAddress, approvedTokenBAddress, addressOftablePairOfA, addresOfStableTokenOfB);

        Pair memory newPair = Pair(
            pairSymbol,
            approvedTokens[approvedTokenAID].tokenAddress,
            approvedTokens[approvedTokenBID].tokenAddress,
            address(newAeolusPair)
        );
        nameToPairID[pairSymbol] = pairID;
        pairs.push(newPair);

        emit PairCreated(pairSymbol, pairID);
    }
}
