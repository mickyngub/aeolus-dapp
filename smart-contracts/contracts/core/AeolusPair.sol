// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

/**
 * @title AeolusPair
 * @author Pichaya Puttekulangkura
 * @custom:experimental This is an experimental contract.
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./interfaces/IAeolusPair.sol";

/**
 * @dev only AeolusFactory is permitted to call this function
 * @param sender tx sender
 */
error NotAeolusFactory(address sender);

/**
 * @dev only AeolusRouter is permitted to call this function
 * @param sender tx sender
 */
error NotAeolusRouter(address sender);

contract AeolusPair is ERC20, IAeolusPair, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public aeolusFactory;
    address public aeolusRouter;

    address public token0;
    address public token1;
    address public stable0;
    address public stable1;

    address public addressPair0LP;
    address public addressPair1LP;

    mapping(address => uint256) public addressToPair0LP;
    mapping(address => uint256) public addressToPair1LP;
    mapping(address => uint256) public addressToAmountInvest;

    constructor(
        address _aeolusRouter,
        string memory _pairName,
        string memory _pairSymbol
    ) ERC20(_pairName, _pairSymbol) {
        aeolusFactory = msg.sender;
        aeolusRouter = _aeolusRouter;
    }

    event Mint(address indexed sender, uint256 amountInvest);
    event Burn(address indexed sender, uint256 currentAmountInvest);

    /**
     * @dev called once by AeolusFactory at time of deployment
     * @param _token0 address of token0
     * @param _token0 address of token1
     * @param _stable0 address of stable pair of token0
     * @param _stable0 address of stable pair of token1
     */
    function initialize(
        address _token0,
        address _token1,
        address _stable0,
        address _stable1
    ) external nonReentrant {
        if (msg.sender != aeolusFactory) revert NotAeolusFactory(msg.sender);
        token0 = _token0;
        token1 = _token1;
        stable0 = _stable0;
        stable1 = _stable1;
    }

    /**
     * @dev called by AeolusRouter to update invest data of msg.sender and mint Aeolus Token
     * @param pair0LP amount of LP from token0 and its stable pair that was added
     * @param pair1LP amount of LP from token1 and its stable pair that was added
     * @param _addressPair0LP address of LP pair 0
     * @param _addressPair1LP address of LP pair 1
     * @param amountInvest amount invested in USDT.e
     * @param investor address of investor
     */
    function addAmountLPInvest(
        uint256 pair0LP,
        uint256 pair1LP,
        address _addressPair0LP,
        address _addressPair1LP,
        uint256 amountInvest,
        address investor
    ) external {
        if (msg.sender != aeolusRouter) revert NotAeolusRouter(msg.sender);
        addressToPair0LP[investor] = pair0LP;
        addressToPair1LP[investor] = pair1LP;
        addressToAmountInvest[investor] = amountInvest;

        IERC20(_addressPair0LP).approve(aeolusRouter, type(uint256).max);
        IERC20(_addressPair1LP).approve(aeolusRouter, type(uint256).max);
        addressPair0LP = _addressPair0LP;
        addressPair1LP = _addressPair1LP;

        mint(investor, amountInvest);
    }

    /**
     * @dev get the amount of invested money and LP
     * @param investor address of the investor
     * @return pair0LP amount of LP from token0 and its stable pair that was added
     * @return pair1LP amount of LP from token1 and its stable pair that was added
     * @return _addressPair0LP address of LP pair 0
     * @return _addressPair1LP address of LP pair 1
     * @return amountInvest amount invested in USDT.e
     */
    function getAmountLPInvest(address investor)
        external
        view
        returns (
            uint256 pair0LP,
            uint256 pair1LP,
            address _addressPair0LP,
            address _addressPair1LP,
            uint256 amountInvest
        )
    {
        return (addressToPair0LP[investor], addressToPair1LP[investor], addressPair0LP, addressPair1LP, addressToAmountInvest[investor]);
    }

    /**
     * @dev called by AeolusRouter to update the amount of invested money and LP of investor to zero
     * @param investor address of the investor
     */
    function removeAmountLPInvest(address investor) external {
        if (msg.sender != aeolusRouter) revert NotAeolusRouter(msg.sender);
        burn(investor, addressToAmountInvest[investor]);
        addressToPair0LP[investor] = 0;
        addressToPair1LP[investor] = 0;
        addressToAmountInvest[investor] = 0;
    }

    /**
     * @dev internal function call for minting Aeolus Token
     * @param to address that Aeolus Token will be sent to
     * @param amountInvest amount of Aeolus Token that will be minted
     */
    function mint(address to, uint256 amountInvest) internal nonReentrant returns (uint256) {
        _mint(to, amountInvest);
        emit Mint(msg.sender, amountInvest);
        return amountInvest;
    }

    /**
     * @dev internal function call for burning Aeolus Token
     * @param to address of Aeolus Token holder
     * @param currentAmountInvest amount of Aeolus Token that will be burned
     */
    function burn(address to, uint256 currentAmountInvest) internal nonReentrant returns (uint256) {
        _burn(to, currentAmountInvest);
        emit Burn(msg.sender, currentAmountInvest);
        return currentAmountInvest;
    }
}
