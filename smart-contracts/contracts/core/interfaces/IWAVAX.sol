// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IWAVAX {
    function deposit() external payable;

    function balanceOf(address owner) external view returns (uint256);

    function withdraw(uint256) external;

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}
