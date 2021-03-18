// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/token/ERC20/ERC20Detailed.sol";

contract FuelToken is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) public ERC20Detailed("Fuel", "Fuel", 1) {
        _mint(msg.sender, initialSupply);
    }
}

contract ClickFuel {
    struct Post {
        address creator;
        string detail;
        uint256 createdTime;
        uint256 flameCount;
        uint256 freezeCount;
    }

    FuelToken public token;
    Post[] public allPosts;
    mapping(address => bool) public users;

    modifier voteable() {
        require(token.transferFrom(msg.sender, address(this), 10));
        _;
    }

    modifier createable() {
        require(token.transferFrom(msg.sender, address(this), 20));
        _;
    }

    constructor() public {
        token = new FuelToken(25000000);
    }

    function transferToken() public {
        token.transfer(msg.sender, 100);
    }

    function createPost(string memory detail) public createable {
        Post memory newPost =
            Post({
                detail: detail,
                creator: msg.sender,
                createdTime: now,
                flameCount: 0,
                freezeCount: 0
            });

        allPosts.push(newPost);
    }

    function vote(bool upvote, uint256 indexOfPost) public voteable {
        Post storage post = allPosts[indexOfPost];

        if (upvote == true) {
            post.flameCount++;
        } else {
            post.freezeCount++;
        }
    }
}
