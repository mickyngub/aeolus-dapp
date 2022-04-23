// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IAeolusPair.sol";
import "./AeolusERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IAeolusFactory.sol";
import "./interfaces/IAeolusCallee.sol";

contract AeolusPair is AeolusERC20, ReentrancyGuard {
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public factory;

    address public token0;
    address public token1;
    address public stable0;
    address public stable1;
    address public usdt;

    mapping(address => uint256) public addressToToken0LP;
    mapping(address => uint256) public addressToToken1LP;

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Aeolus: TRANSFER_FAILED");
    }

    event Mint(address indexed sender, uint256 amountLiquidity);
    event Burn(address indexed sender, uint256 amountUSDT, address indexed to);

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(
        address _token0,
        address _token1,
        address _stable0,
        address _stable1
    ) external {
        require(msg.sender == factory, "Aeolus: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
        stable0 = _stable0;
        stable1 = _stable1;
    }

    function addAmountLPInvest(
        uint256 token0LP,
        uint256 token1LP,
        address investor
    ) public {
        addressToToken0LP[investor] = token0LP;
        addressToToken1LP[investor] = token1LP;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to, uint256 amountInvest) external nonReentrant returns (uint256) {
        _mint(to, amountInvest);
        emit Mint(msg.sender, amountInvest);
        return amountInvest;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external nonReentrant returns (uint256 amountUSDT) {
        uint256 liquidity = balanceOf[address(this)];

        uint256 _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        require(_totalSupply > 0, "Aeolus: INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(address(this), liquidity);
        _safeTransfer(usdt, to, amountUSDT);

        emit Burn(msg.sender, amountUSDT, to);
    }
}
