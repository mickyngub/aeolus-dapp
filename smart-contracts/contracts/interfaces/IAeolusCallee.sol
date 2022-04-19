// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.9;

interface IAeolusCallee {
    function aeolusCall(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}
