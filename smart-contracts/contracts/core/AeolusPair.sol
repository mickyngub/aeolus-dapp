// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IAeolusPair.sol";
import "./interfaces/IAeolusFactory.sol";

contract AeolusPair is ERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public aeolusFactory;
    address public aeolusRouter;

    address public token0;
    address public token1;
    address public stable0;
    address public stable1;
    address public usdt;

    mapping(address => uint256) public addressToToken0LP;
    mapping(address => uint256) public addressToToken1LP;
    mapping(address => uint256) public addressToAmountInvest;

    constructor(
        address _aeolusRouter,
        string memory _pairName,
        string memory _pairSymbol
    ) ERC20(_pairName, _pairSymbol) {
        aeolusFactory = msg.sender;
        aeolusRouter = _aeolusRouter;
    }

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Aeolus: TRANSFER_FAILED");
    }

    event Mint(address indexed sender, uint256 amountInvest);
    event Burn(address indexed sender, uint256 currentAmountInvest);

    // called once by the aeolusFactory at time of deployment
    function initialize(
        address _token0,
        address _token1,
        address _stable0,
        address _stable1
    ) external {
        require(msg.sender == aeolusFactory, "Aeolus: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
        stable0 = _stable0;
        stable1 = _stable1;
    }

    function addAmountLPInvest(
        uint256 pair0LP,
        uint256 pair1LP,
        address addressPair0LP,
        address addressPair1LP,
        uint256 amountInvest,
        address investor
    ) public {
        require(msg.sender == aeolusRouter, "Aeolus: ROUTER FORBIDDEN");
        addressToToken0LP[investor] = pair0LP;
        addressToToken1LP[investor] = pair1LP;
        addressToAmountInvest[investor] = amountInvest;
        _approveTokenIfNeeded(addressPair0LP);
        _approveTokenIfNeeded(addressPair1LP);
        mint(investor, amountInvest);
    }

    function getAmountLPInvest(address investor)
        external
        view
        returns (
            uint256 token0LP,
            uint256 token1LP,
            uint256 amountInvest
        )
    {
        return (addressToToken0LP[investor], addressToToken1LP[investor], addressToAmountInvest[investor]);
    }

    function removeAmountLPInvest(address investor) external {
        require(msg.sender == aeolusRouter, "Aeolus: ROUTER REMOVE FORBIDDEN");
        burn(investor, addressToAmountInvest[investor]);
        addressToToken0LP[investor] = 0;
        addressToToken1LP[investor] = 0;
        addressToAmountInvest[investor] = 0;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to, uint256 amountInvest) internal nonReentrant returns (uint256) {
        _mint(to, amountInvest);
        emit Mint(msg.sender, amountInvest);
        return amountInvest;
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to, uint256 currentAmountInvest) internal nonReentrant returns (uint256) {
        _burn(to, currentAmountInvest);
        emit Burn(msg.sender, currentAmountInvest);
        return currentAmountInvest;
    }

    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), aeolusRouter) == 0) {
            IERC20(token).approve(aeolusRouter, type(uint256).max);
        }
    }
}
