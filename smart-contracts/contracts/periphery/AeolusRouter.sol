// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./libraries/AeolusLibrary.sol";

import "./interfaces/IAeolusRouter.sol";
import "./interfaces/IExchangeRouter.sol";

import "../core/interfaces/IERC20.sol";
import "../core/interfaces/IAeolusFactory.sol";
import "../core/interfaces/IAeolusPair.sol";

contract AeolusRouter is IAeolusRouter, Ownable {
    IAeolusFactory public FACTORY;
    // Exchange Router for swapping, addding lp, removing lp
    IExchangeRouter public ROUTER;

    address public constant USDTdotE = 0xc7198437980c041c805a1edcba50c1ce5db95118;

    constructor(address _factory, address _router) {
        FACTORY = IAeolusFactory(_factory);
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

    /** 
    ADMIN Function for updating FACTORY and ROUTER
     */

    function updateFactory(address _factory) external onlyOwner {
        FACTORY = IAeolusFactory(_factory);
    }

    function updateExchangeRouter(address _router) external onlyOwner {
        ROUTER = IExchangeRouter(_router);
    }

    /* ========== Private Functions ========== */

    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), address(ROUTER)) == 0) {
            IERC20(token).approve(address(ROUTER), type(uint256).max);
        }
    }
}
