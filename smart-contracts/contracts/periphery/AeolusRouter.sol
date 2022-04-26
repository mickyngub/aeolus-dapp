// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

/**
 * @title AeolusRouter
 * @author Pichaya Puttekulangkura
 * @custom:experimental This is an experimental contract.
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IAeolusRouter.sol";
import "./interfaces/IExchangeRouter.sol";

import "../core/AeolusFactory.sol";
import "../core/AeolusPair.sol";

import "hardhat/console.sol";

/**
 * @dev need to invest more than 0 USDT.e
 * @param amountInvest sent amount
 */

error InvalidAmount(uint256 amountInvest);
/**
 * @dev currentAmountInvest needs to be more than 0 USDT.e
 * @param currentAmountInvest current amount invest
 */
error NotInvestor(uint256 currentAmountInvest);

/**
 * @dev token addresses sent are identical
 * @param tokenAddress address of token
 */
error IdenticalTokenAddress(address tokenAddress);

contract AeolusRouter is IAeolusRouter, Ownable {
    using SafeERC20 for IERC20;
    /**
     * @dev AeolusFactory for creating and getting pair
     */
    AeolusFactory public FACTORY;

    /**
     * @dev Exchange Router for swapping, addding lp, removing lp
     */
    IExchangeRouter public EXCHANGE_ROUTER;

    address public exchangeFactory;
    address public USDTdotE;
    address public WAVAX;

    constructor(
        address _factory,
        address _router,
        address _USDTdotE,
        address _WAVAX,
        address _exchangeFactory
    ) {
        FACTORY = AeolusFactory(_factory);
        EXCHANGE_ROUTER = IExchangeRouter(_router);
        USDTdotE = _USDTdotE;
        WAVAX = _WAVAX;
        exchangeFactory = _exchangeFactory;
    }

    receive() external payable {}

    /**
     * @dev invest money into selected pair ID
     * @param pairID pair ID in AeolusFactory
     * @param amountInvest amount of money invest in USDT.e (6 decimals)
     */

    function investPair(uint256 pairID, uint256 amountInvest) external returns (uint256 amountTokenALP, uint256 amountTokenBLP) {
        if (amountInvest == 0) revert InvalidAmount(amountInvest);
        IERC20(USDTdotE).safeTransferFrom(msg.sender, address(this), amountInvest);
        _approveTokenIfNeeded(USDTdotE);

        (, address tokenA, address tokenB, address aeolusPairAddress) = FACTORY.getPair(pairID);
        address tokenAStable = FACTORY.getStableAddressOfApprovedToken(tokenA);
        address tokenBStable = FACTORY.getStableAddressOfApprovedToken(tokenB);

        // Cannot use this - STACK TOO DEEP uint256 quarterAmountInvest = amountInvest / 4;
        uint256 amountTokenA = _swap(USDTdotE, amountInvest / 4, tokenA, address(this));
        uint256 amountTokenB = _swap(USDTdotE, amountInvest / 4, tokenB, address(this));

        // amountInvest is USDT.e which has 6 decimals, thus need to convert for AeolusPair LP
        uint256 amountInvest18Decimal = amountInvest * 10**12;

        uint256 amountTokenAStable = amountInvest / 4;
        uint256 amountTokenBStable = amountInvest / 4;
        if (tokenAStable != USDTdotE) {
            amountTokenAStable = _swap(USDTdotE, amountInvest / 4, tokenAStable, address(this));
        }

        if (tokenBStable != USDTdotE) {
            amountTokenBStable = _swap(USDTdotE, amountInvest / 4, tokenBStable, address(this));
        }

        _approveTokenIfNeeded(tokenA);
        _approveTokenIfNeeded(tokenB);
        _approveTokenIfNeeded(tokenAStable);
        _approveTokenIfNeeded(tokenBStable);

        (, , amountTokenALP) = EXCHANGE_ROUTER.addLiquidity(tokenA, tokenAStable, amountTokenA, amountTokenAStable, 0, 0, aeolusPairAddress, block.timestamp);
        (, , amountTokenBLP) = EXCHANGE_ROUTER.addLiquidity(tokenB, tokenBStable, amountTokenB, amountTokenBStable, 0, 0, aeolusPairAddress, block.timestamp);

        address pairALPAddress = _pairFor(exchangeFactory, tokenA, tokenAStable);
        address pairBLPAddress = _pairFor(exchangeFactory, tokenB, tokenBStable);

        // Cannot use amountInvest for quarterAmountInvest - STACK TOO DEEP
        AeolusPair(aeolusPairAddress).addAmountLPInvest(amountTokenALP, amountTokenBLP, pairALPAddress, pairBLPAddress, amountInvest18Decimal, msg.sender);
    }

    /**
     * @dev redeem invested money
     * @param pairID pair ID in AeolusFactory
     */

    function redeemPair(uint256 pairID) external {
        (, address tokenA, address tokenB, address aeolusPairAddress) = FACTORY.getPair(pairID);
        (uint256 pair0LP, uint256 pair1LP, address addressPair0LP, address addressPair1LP, uint256 amountInvest) = AeolusPair(aeolusPairAddress)
            .getAmountLPInvest(msg.sender);

        if (amountInvest == 0) revert NotInvestor({currentAmountInvest: amountInvest});

        address tokenAStable = FACTORY.getStableAddressOfApprovedToken(tokenA);
        address tokenBStable = FACTORY.getStableAddressOfApprovedToken(tokenB);
        IERC20(addressPair0LP).safeTransferFrom(aeolusPairAddress, address(this), pair0LP);
        IERC20(addressPair1LP).safeTransferFrom(aeolusPairAddress, address(this), pair1LP);
        _approveTokenIfNeeded(addressPair0LP);
        _approveTokenIfNeeded(addressPair1LP);

        // Quick solution - STACK TOO DEEP
        (, address tokenA2, address tokenB2, ) = FACTORY.getPair(pairID);

        (uint256 amountTokenA, uint256 amountTokenAStable) = EXCHANGE_ROUTER.removeLiquidity(
            tokenA2,
            tokenAStable,
            pair0LP,
            0,
            0,
            address(this),
            block.timestamp
        );
        (uint256 amountTokenB, uint256 amountTokenBStable) = EXCHANGE_ROUTER.removeLiquidity(
            tokenB2,
            tokenBStable,
            pair1LP,
            0,
            0,
            address(this),
            block.timestamp
        );

        uint256 amountUSDTdoteRedeem = _swap(tokenA2, amountTokenA, USDTdotE, address(this)) + _swap(tokenB2, amountTokenB, USDTdotE, address(this));
        if (tokenAStable == USDTdotE) {
            amountUSDTdoteRedeem = amountUSDTdoteRedeem + amountTokenAStable;
        } else {
            amountUSDTdoteRedeem = amountUSDTdoteRedeem + _swap(tokenAStable, amountTokenAStable, USDTdotE, address(this));
        }

        if (tokenBStable == USDTdotE) {
            amountUSDTdoteRedeem = amountUSDTdoteRedeem + amountTokenAStable;
        } else {
            amountUSDTdoteRedeem = amountUSDTdoteRedeem + _swap(tokenBStable, amountTokenBStable, USDTdotE, address(this));
        }
        AeolusPair(aeolusPairAddress).removeAmountLPInvest(msg.sender);
        IERC20(USDTdotE).safeTransfer(msg.sender, amountUSDTdoteRedeem);
    }

    /**
     * @dev private function for sorting token by address
     */
    function sortTokens(address tokenA, address tokenB) private pure returns (address token0, address token1) {
        if (tokenA == tokenB) revert IdenticalTokenAddress(tokenA);
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        if (token0 == address(0)) revert ZeroAddress(token0);
    }

    /**
     * @dev private function for getting address of LP pair
     */
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

    /**
     * @dev private function for approving token spending
     */
    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), address(EXCHANGE_ROUTER)) == 0) {
            IERC20(token).approve(address(EXCHANGE_ROUTER), type(uint256).max);
        }
    }

    /**
     * @dev private function for swapping
     */
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

        uint256[] memory amounts = EXCHANGE_ROUTER.swapExactTokensForTokens(amountInvest, 0, path, receiver, block.timestamp);
        return uint256(amounts[amounts.length - 1]);
    }

    /**
     * @dev ADMIN function for updating Exchange Router address
     */
    function updateExchangeRouter(address _router) external onlyOwner {
        EXCHANGE_ROUTER = IExchangeRouter(_router);
    }

    /**
     * @dev ADMIN function for updating Exchange Factory address
     */
    function updateExchangeFactory(address _exchangeFactory) external onlyOwner {
        exchangeFactory = _exchangeFactory;
    }
}
