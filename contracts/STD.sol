// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/*
Eclair packs functions that we use in simulations to check if the funds have been drained.
*/

contract STD {
    using SafeERC20 for IERC20;

    // MARK: - Constructor

    constructor() {}

    // MARK: - Accessors

    /// Returns the number of tokens owner by this contract.
    function balanceOf(IERC20 token) public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
