// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusPair {
    function aeolusFactory() external view returns (address);

    function aeolusRouter() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function stable0() external view returns (address);

    function stable1() external view returns (address);

    function addressPair0LP() external view returns (address);

    function addressPair1LP() external view returns (address);

    function initialize(
        address,
        address,
        address,
        address
    ) external;

    function addAmountLPInvest(
        uint256 pair0LP,
        uint256 pair1LP,
        address _addressPair0LP,
        address _addressPair1LP,
        uint256 amountInvest,
        address investor
    ) external;

    function getAmountLPInvest(address investor)
        external
        returns (
            uint256 pair0LP,
            uint256 pair1LP,
            address _addressPair0LP,
            address _addressPair1LP,
            uint256 amountInvest
        );

    function removeAmountLPInvest(address investor) external;
}
