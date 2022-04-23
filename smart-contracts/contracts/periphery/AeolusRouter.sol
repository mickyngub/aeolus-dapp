// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./libraries/AeolusLibrary.sol";

import "./interfaces/IAeolusRouter.sol";
import "./interfaces/IExchangeRouter.sol";

import "../core/interfaces/IERC20.sol";
import "../core/AeolusFactory.sol";
import "../core/interfaces/IAeolusPair.sol";

contract AeolusRouter is IAeolusRouter, Ownable {
    AeolusFactory public FACTORY;
    // Exchange Router for swapping, addding lp, removing lp
    IExchangeRouter public ROUTER;

    address public constant USDTdotE = 0xc7198437980c041c805a1edcba50c1ce5db95118;
    address public constant WAVAX = 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7;

    constructor(address _factory, address _router) {
        FACTORY = AeolusFactory(_factory);
        ROUTER = IExchangeRouter(_router);
    }

    receive() external payable {}

    function investPair(uint256 pairID, uint256 amount)
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        IERC20(USDTdotE).transferFrom(msg.sender, address(this), amount);
        _approveTokenIfNeeded(USDTdotE);

        (, address tokenA, address tokenB) = FACTORY.getPair(pairID);
        address tokenAStable = FACTORY.getStableAddressOfApprovedToken(tokenA);
        address tokenBStable = FACTORY.getStableAddressOfApprovedToken(tokenB);
    }

    // **** REMOVE LIQUIDITY ****
    function redeem(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    ) public returns (uint256 amountA, uint256 amountB) {}

    /* ========== Private Functions ========== */

    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), address(ROUTER)) == 0) {
            IERC20(token).approve(address(ROUTER), type(uint256).max);
        }
    }

    function _swap(
        address _from,
        uint256 amount,
        address _to,
        address receiver
    ) private returns (uint256) {
        address[] memory path;

        path = new address[](3);
        path[0] = _from;
        path[1] = WAVAX;
        path[2] = _to;

        uint256[] memory amounts = ROUTER.swapExactTokensForTokens(amount, 0, path, receiver, block.timestamp);
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
