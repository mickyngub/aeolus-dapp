// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusRouter {
    function investPair(uint64 pairID, uint64 amount) external returns (uint256 tokenALP, uint256 tokenBLP);

    // function investTriple(
    //     address usdt,
    //     uint256 amountADesired,
    //     uint256 amountBDesired,
    //     uint256 amountAMin,
    //     uint256 amountBMin,
    //     address to,
    //     uint256 deadline
    // )
    //     external
    //     returns (
    //         uint256 amountA,
    //         uint256 amountB,
    //         uint256 liquidity
    //     );

    // function redeemPair(
    //     address tokenA,
    //     address tokenB,
    //     uint256 liquidity,
    //     uint256 amountAMin,
    //     uint256 amountBMin,
    //     address to,
    //     uint256 deadline
    // ) external returns (uint256 amountA, uint256 amountB);

    // function redeemTriple(
    //     address tokenA,
    //     address tokenB,
    //     uint256 liquidity,
    //     uint256 amountAMin,
    //     uint256 amountBMin,
    //     address to,
    //     uint256 deadline
    // ) external returns (uint256 amountA, uint256 amountB);
}
