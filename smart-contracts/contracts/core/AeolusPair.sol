// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AeolusPair is ERC20, ReentrancyGuard {
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
        address _addressPair0LP,
        address _addressPair1LP,
        uint256 amountInvest,
        address investor
    ) public {
        require(msg.sender == aeolusRouter, "Aeolus: ROUTER FORBIDDEN");
        addressToPair0LP[investor] = pair0LP;
        addressToPair1LP[investor] = pair1LP;
        addressToAmountInvest[investor] = amountInvest;

        IERC20(_addressPair0LP).approve(aeolusRouter, type(uint256).max);
        IERC20(_addressPair1LP).approve(aeolusRouter, type(uint256).max);
        addressPair0LP = _addressPair0LP;
        addressPair1LP = _addressPair1LP;

        mint(investor, amountInvest);
    }

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

    function removeAmountLPInvest(address investor) external {
        require(msg.sender == aeolusRouter, "Aeolus: ROUTER REMOVE FORBIDDEN");
        burn(investor, addressToAmountInvest[investor]);
        addressToPair0LP[investor] = 0;
        addressToPair1LP[investor] = 0;
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
}
