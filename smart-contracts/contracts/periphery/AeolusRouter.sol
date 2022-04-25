// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IAeolusRouter.sol";
import "./interfaces/IExchangeRouter.sol";

import "../core/AeolusFactory.sol";
import "../core/AeolusPair.sol";

import "hardhat/console.sol";

contract AeolusRouter is IAeolusRouter, Ownable {
    using SafeERC20 for IERC20;
    AeolusFactory public FACTORY;
    // Exchange Router for swapping, addding lp, removing lp
    IExchangeRouter public ROUTER;

    // address public USDTdotE = 0xc7198437980c041c805a1edcba50c1ce5db95118;
    // address public WAVAX = 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7;
    address public USDTdotE;
    address public WAVAX;

    constructor(
        address _factory,
        address _router,
        address _USDTdotE,
        address _WAVAX
    ) {
        FACTORY = AeolusFactory(_factory);
        ROUTER = IExchangeRouter(_router);
        USDTdotE = _USDTdotE;
        WAVAX = _WAVAX;
    }

    receive() external payable {}

    function investPair(uint256 pairID, uint256 amountInvest) external returns (uint256 tokenALP, uint256 tokenBLP) {
        IERC20(USDTdotE).safeTransferFrom(msg.sender, address(this), amountInvest);
        _approveTokenIfNeeded(USDTdotE);

        // amountInvest is USDT.e which has 6 decimals, thus need to convert for AeolusPair LP
        uint256 amountInvest18Decimal = amountInvest * 10**12;
        (, address tokenA, address tokenB, address aeolusPairAddress) = FACTORY.getPair(pairID);
        // console.log("address A is %s address B is %s address pair is %s", tokenA, tokenB, aeolusPairAddress);
        address tokenAStable = FACTORY.getStableAddressOfApprovedToken(tokenA);
        address tokenBStable = FACTORY.getStableAddressOfApprovedToken(tokenB);
        uint256 quarterAmountInvest = amountInvest / 4;
        // console.log("address A's stable is %s address B's stable is %s invest amountInvest is %s", tokenAStable, tokenBStable, quarterAmountInvest);
        console.log("amount invest is %s quarter is %s", amountInvest, quarterAmountInvest);
        uint256 amountTokenA = _swap(USDTdotE, quarterAmountInvest, tokenA, address(this));
        uint256 amountTokenB = _swap(USDTdotE, quarterAmountInvest, tokenB, address(this));
        console.log("amountTokenA %s WBTC.e 6 decimals - amountTokenB %s WETH.e 18 decimals", amountTokenA, amountTokenB);
        uint256 amountTokenAStable = quarterAmountInvest;
        uint256 amountTokenBStable = quarterAmountInvest;
        if (tokenAStable != USDTdotE) {
            amountTokenAStable = _swap(USDTdotE, quarterAmountInvest, tokenAStable, address(this));
        }

        if (tokenBStable != USDTdotE) {
            amountTokenBStable = _swap(USDTdotE, quarterAmountInvest, tokenBStable, address(this));
        }
        console.log("amountTokenAStable %s - amountTokenBStable", amountTokenAStable, amountTokenBStable);
        _approveTokenIfNeeded(tokenA);
        _approveTokenIfNeeded(tokenB);
        _approveTokenIfNeeded(tokenAStable);
        _approveTokenIfNeeded(tokenBStable);
        (, , tokenALP) = ROUTER.addLiquidity(tokenA, tokenAStable, amountTokenA, amountTokenAStable, 0, 0, aeolusPairAddress, block.timestamp);
        (, , tokenBLP) = ROUTER.addLiquidity(tokenB, tokenBStable, amountTokenB, amountTokenBStable, 0, 0, aeolusPairAddress, block.timestamp);

        // Cannot use amountInvest for quarterAmountInvest since stack is too deep
        AeolusPair(aeolusPairAddress).addAmountLPInvest(tokenALP, tokenBLP, amountInvest18Decimal, msg.sender);
    }

    // **** REMOVE LIQUIDITY ****
    // function redeemPair(
    //     address tokenA,
    //     address tokenB,
    //     uint256 liquidity,
    //     uint256 amountAMin,
    //     uint256 amountBMin,
    //     address to
    // ) public returns (uint256 amountA, uint256 amountB) {}

    /* ========== Private Functions ========== */

    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), address(ROUTER)) == 0) {
            IERC20(token).approve(address(ROUTER), type(uint256).max);
        }
    }

    function _swap(
        address _from,
        uint256 amountInvest,
        address _to,
        address receiver
    ) private returns (uint256) {
        address[] memory path;

        path = new address[](3);
        path[0] = _from;
        path[1] = WAVAX;
        path[2] = _to;

        uint256[] memory amounts = ROUTER.swapExactTokensForTokens(amountInvest, 0, path, receiver, block.timestamp);
        return amounts[amounts.length - 1];
    }

    /* ========== Admin FUNCTIONS ========== */

    function updateFactory(address _factory) external onlyOwner {
        FACTORY = AeolusFactory(_factory);
    }

    function updateExchangeRouter(address _router) external onlyOwner {
        ROUTER = IExchangeRouter(_router);
    }
}
