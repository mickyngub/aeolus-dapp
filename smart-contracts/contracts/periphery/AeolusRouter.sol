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
    address public exchangeFactory = 0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10;

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

    function investPair(uint64 pairID, uint64 amountInvest) external returns (uint256 amountTokenALP, uint256 amountTokenBLP) {
        IERC20(USDTdotE).safeTransferFrom(msg.sender, address(this), amountInvest);
        _approveTokenIfNeeded(USDTdotE);

        (, address tokenA, address tokenB, address aeolusPairAddress) = FACTORY.getPair(pairID);
        address tokenAStable = FACTORY.getStableAddressOfApprovedToken(tokenA);
        address tokenBStable = FACTORY.getStableAddressOfApprovedToken(tokenB);

        // Cannot use this - STACK TOO DEEP uint64 quarterAmountInvest = amountInvest / 4;
        // console.log("amount invest is %s quarter is %s", amountInvest, quarterAmountInvest);
        uint64 amountTokenA = _swap(USDTdotE, amountInvest / 4, tokenA, address(this));
        uint64 amountTokenB = _swap(USDTdotE, amountInvest / 4, tokenB, address(this));
        // console.log("amountTokenA %s WBTC.e 6 decimals - amountTokenB %s WETH.e 18 decimals", amountTokenA, amountTokenB);

        // amountInvest is USDT.e which has 6 decimals, thus need to convert for AeolusPair LP
        uint64 amountInvest18Decimal = amountInvest * 10**12;

        uint64 amountTokenAStable = amountInvest / 4;
        uint64 amountTokenBStable = amountInvest / 4;
        if (tokenAStable != USDTdotE) {
            amountTokenAStable = _swap(USDTdotE, amountInvest / 4, tokenAStable, address(this));
        }

        if (tokenBStable != USDTdotE) {
            amountTokenBStable = _swap(USDTdotE, amountInvest / 4, tokenBStable, address(this));
        }
        // console.log("amountTokenAStable %s - amountTokenBStable", amountTokenAStable, amountTokenBStable);

        _approveTokenIfNeeded(tokenA);
        _approveTokenIfNeeded(tokenB);
        _approveTokenIfNeeded(tokenAStable);
        _approveTokenIfNeeded(tokenBStable);

        (, , amountTokenALP) = ROUTER.addLiquidity(tokenA, tokenAStable, amountTokenA, amountTokenAStable, 0, 0, aeolusPairAddress, block.timestamp);
        (, , amountTokenBLP) = ROUTER.addLiquidity(tokenB, tokenBStable, amountTokenB, amountTokenBStable, 0, 0, aeolusPairAddress, block.timestamp);

        address pairALPAddress = _pairFor(exchangeFactory, tokenA, tokenAStable);
        address pairBLPAddress = _pairFor(exchangeFactory, tokenB, tokenBStable);

        // Cannot use amountInvest for quarterAmountInvest since stack is too deep
        AeolusPair(aeolusPairAddress).addAmountLPInvest(amountTokenALP, amountTokenBLP, pairALPAddress, pairBLPAddress, amountInvest18Decimal, msg.sender);
    }

    // **** REMOVE LIQUIDITY ****
    // function redeemPair(uint256 pairID) public returns (uint256 amountA, uint256 amountB) {
    //     (, address tokenA, address tokenB, address aeolusPairAddress) = FACTORY.getPair(pairID);
    //     (uint256 token0LP, uint256 token1LP, uint256 amountInvest) = AeolusPair(aeolusPairAddress).getAmountLPInvest(msg.sender);
    // }

    /* ========== Private Functions ========== */

    function sortTokens(address tokenA, address tokenB) private pure returns (address token0, address token1) {
        require(tokenA != tokenB, "Aeolus: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "Aeolus: ZERO_ADDRESS");
    }

    function _pairFor(
        address factory,
        address tokenA,
        address tokenB
    ) private pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encodePacked(token0, token1)),
                            hex"0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91" // init code fuji
                        )
                    )
                )
            )
        );
    }

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
    ) private returns (uint64) {
        address[] memory path;

        path = new address[](3);
        path[0] = _from;
        path[1] = WAVAX;
        path[2] = _to;

        uint256[] memory amounts = ROUTER.swapExactTokensForTokens(amountInvest, 0, path, receiver, block.timestamp);
        return uint64(amounts[amounts.length - 1]);
    }

    /* ========== Admin FUNCTIONS ========== */

    function updateFactory(address _factory) external onlyOwner {
        FACTORY = AeolusFactory(_factory);
    }

    function updateExchangeFactory(address _exchangeFactory) external onlyOwner {
        exchangeFactory = _exchangeFactory;
    }

    function updateExchangeRouter(address _router) external onlyOwner {
        ROUTER = IExchangeRouter(_router);
    }
}
