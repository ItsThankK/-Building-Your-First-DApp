// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OrgsErc20Token is ERC20 {
    address owner;

    constructor() ERC20("MyOrgsToken", "MOT") {
        owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

