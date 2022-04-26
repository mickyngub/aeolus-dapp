// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusFactory {
    function getPair(uint256)
        external
        view
        returns (
            string memory,
            address,
            address,
            address
        );

    function getNumberOfPools() external view returns (uint256);

    function getNumberOfApprovedTokens() external view returns (uint256);

    function getNumberOfStableTokens() external view returns (uint256);

    function getStableTokenOfApprovedToken(string memory) external view returns (string memory, address); // function createPair(string memory _tokenSymbolA, string memory _tokenSymbolB) external returns (string memory pairName);

    function getStableAddressOfApprovedToken(address) external view returns (address);

    function addApprovedToken(string memory, address) external;

    function addStableToken(string memory, address) external;

    function linkOrUpdateApprovedTokenToStableToken(string memory, string memory) external;

  
}
