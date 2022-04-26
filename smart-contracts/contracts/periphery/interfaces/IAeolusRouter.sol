// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusRouter {
    function USDTdotE() external view returns (address);

    function WAVAX() external view returns (address);

    function exchangeFactory() external view returns (address);

    function investPair(uint256 pairID, uint256 amount) external returns (uint256 tokenALP, uint256 tokenBLP);

    function redeemPair(uint256 pairID) external;

    function updateFactory(address _factory) external;

    function updateExchangeFactory(address _exchangeFactory) external;

    function updateExchangeRouter(address _router) external;
}
