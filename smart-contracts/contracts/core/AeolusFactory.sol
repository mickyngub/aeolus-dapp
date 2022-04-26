// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

/**
 * @title AeolusFactory
 * @author Pichaya Puttekulangkura
 * @custom:experimental This is an experimental contract.
 */

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IAeolusFactory.sol";
import "./AeolusPair.sol";

/**
 * @dev token needs to be approved
 * @param tokenSymbol symbol of token
 */
error TokenNotApproved(string tokenSymbol);

/**
 * @dev token is already approved
 * @param tokenSymbol symbol of token
 * @param tokenAddress address of token
 */
error TokenAlreadyApproved(string tokenSymbol, address tokenAddress);

/**
 * @dev token has no stable pair
 * @param tokenSymbol symbol of token
 */
error TokenHasNoStablePair(string tokenSymbol);

/**
 * @dev address sent is address(0)
 * @param tokenAddress sent token address
 */
error ZeroAddress(address tokenAddress);

/**
 * @dev token symbols sent are identical
 * @param tokenSymbol symbol of token
 */
error IdenticalTokenSymbol(string tokenSymbol);

contract AeolusFactory is IAeolusFactory, ReentrancyGuard, Ownable {
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

    /**
     * @dev make the arrays start from index 1 since mapping will always return 0 if DNE
     */
    constructor() {
        approvedTokens.push(ApprovedToken("BaseApprovedToken", address(0)));
        stableTokens.push(StableToken("BaseStableToken", address(0)));
        pairs.push(Pair("BasePair", address(0), address(0), address(0)));
    }

    /**
     * @dev get created AeolusPair by poolID
     * @param poolID poolID of created AeolusPair
     * @return name name of the created AeolusPair
     * @return tokenA address of tokenA
     * @return tokenB address of tokenB
     * @return aeolusPairAddress address of created AeolusPair
     */
    function getPair(uint256 poolID)
        external
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

    /**
     * @dev get number of created AeolusPair
     */
    function getNumberOfPools() external view returns (uint256 numberOfPools) {
        return pairs.length - 1;
    }

    /**
     * @dev get number of approved tokens
     */
    function getNumberOfApprovedTokens() external view returns (uint256 numberOfApprovedTokens) {
        return approvedTokens.length - 1;
    }

    /**
     * @dev get number of approved stable tokens
     */
    function getNumberOfStableTokens() external view returns (uint256 numberOfStableTokens) {
        return stableTokens.length - 1;
    }

    /**
     * @dev get stable token's symbol and address of approved token
     * @param _symbolApprovedToken symbol of approved token
     * @return stableSymbol symbol of stable token of the approved token
     * @return stableAddress address of stable token of the approved token
     */
    function getStableTokenOfApprovedToken(string memory _symbolApprovedToken) external view returns (string memory stableSymbol, address stableAddress) {
        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stableTokenID = approvedTokenIDToStableTokenID[approvedTokenID];
        StableToken memory stableToken = stableTokens[stableTokenID];
        return (stableToken.stableSymbol, stableToken.stableAddress);
    }

    /**
     * @dev get stable token's address of approved token
     * @param approvedToken address of approved token
     * @return stableAddress address of stable token of approved token
     */
    function getStableAddressOfApprovedToken(address approvedToken) external view returns (address stableAddress) {
        return addressApprovedTokenToAddressStableToken[approvedToken];
    }

    /**
     * @dev ADMIN function for adding approved token
     * @param _symbolApprovedToken symbol of approved token
     * @param _address address of approved token
     */
    function addApprovedToken(string memory _symbolApprovedToken, address _address) external onlyOwner {
        if (symbolToApprovedTokenID[_symbolApprovedToken] != 0) revert TokenAlreadyApproved(_symbolApprovedToken, _address);
        if (_address == address(0)) revert ZeroAddress(_address);

        ApprovedToken memory newApprovedToken = ApprovedToken(_symbolApprovedToken, _address);
        symbolToApprovedTokenID[_symbolApprovedToken] = approvedTokens.length;
        approvedTokens.push(newApprovedToken);
    }

    /**
     * @dev ADMIN function for adding stable token
     * @param _symbolStableToken symbol of stable token
     * @param _address address of stable token
     */
    function addStableToken(string memory _symbolStableToken, address _address) external onlyOwner {
        if (symbolToStableTokenID[_symbolStableToken] != 0) revert TokenAlreadyApproved(_symbolStableToken, _address);
        if (_address == address(0)) revert ZeroAddress(_address);

        StableToken memory newStableToken = StableToken(_symbolStableToken, _address);
        symbolToStableTokenID[_symbolStableToken] = stableTokens.length;
        stableTokens.push(newStableToken);
    }

    /**
     * @dev ADMIN function for linking or updating pair between approved token and stable token
     * @param _symbolApprovedToken symbol of approved token
     * @param _symbolStableToken symbol of stable token
     */
    function linkOrUpdateApprovedTokenToStableToken(string memory _symbolApprovedToken, string memory _symbolStableToken) external onlyOwner {
        if (symbolToApprovedTokenID[_symbolApprovedToken] == 0) revert TokenNotApproved(_symbolApprovedToken);
        if (symbolToStableTokenID[_symbolStableToken] == 0) revert TokenNotApproved(_symbolStableToken);

        uint256 approvedTokenID = symbolToApprovedTokenID[_symbolApprovedToken];
        uint256 stableTokenID = symbolToStableTokenID[_symbolStableToken];

        ApprovedToken memory approvedToken = approvedTokens[approvedTokenID];
        StableToken memory stableToken = stableTokens[stableTokenID];

        addressApprovedTokenToAddressStableToken[approvedToken.tokenAddress] = stableToken.stableAddress;
        approvedTokenIDToStableTokenID[approvedTokenID] = stableTokenID;
    }

    /**
     * @dev ADMIN function for creating AeolusPair
     * @param _symbolTokenA symbol of approved tokenA
     * @param _symbolTokenB symbol of approved tokenB
     * @param _aeolusRouter address of AeolusRouter
     */
    function createPair(
        string memory _symbolTokenA,
        string memory _symbolTokenB,
        address _aeolusRouter
    ) external onlyOwner nonReentrant returns (AeolusPair newAeolusPair) {
        if (keccak256(abi.encodePacked(_symbolTokenA)) == keccak256(abi.encodePacked(_symbolTokenB))) revert IdenticalTokenSymbol(_symbolTokenA);
        // Check whether the token has been approved yet
        uint256 approvedTokenAID = symbolToApprovedTokenID[_symbolTokenA];
        uint256 approvedTokenBID = symbolToApprovedTokenID[_symbolTokenB];

        if (approvedTokenAID == 0) revert TokenNotApproved(_symbolTokenA);
        if (approvedTokenBID == 0) revert TokenNotApproved(_symbolTokenB);

        address approvedTokenAAddress = approvedTokens[approvedTokenAID].tokenAddress;
        address approvedTokenBAddress = approvedTokens[approvedTokenBID].tokenAddress;

        StableToken memory stableTokenOfA = stableTokens[(approvedTokenIDToStableTokenID[approvedTokenAID])];
        StableToken memory stableTokenOfB = stableTokens[(approvedTokenIDToStableTokenID[approvedTokenBID])];

        if (approvedTokenIDToStableTokenID[approvedTokenAID] == 0) revert TokenHasNoStablePair(_symbolTokenA);
        if (approvedTokenIDToStableTokenID[approvedTokenBID] == 0) revert TokenHasNoStablePair(_symbolTokenB);

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
