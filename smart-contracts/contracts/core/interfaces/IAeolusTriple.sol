// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusTriple {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    event Mint(address indexed sender, uint256 amount0, uint256 amount1, uint256 amount2);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, uint256 amount2, address indexed to);

    function factory() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function token2() external view returns (address);

    function getReserves()
        external
        view
        returns (
            uint256 reserve0,
            uint256 reserve1,
            uint256 reserve2
        );

    function mint(address to) external returns (uint256 liquidity);

    function burn(address to) external returns (uint256 money);

    function initialize(address, address) external;
}
