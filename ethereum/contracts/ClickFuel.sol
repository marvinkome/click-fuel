// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FuelToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Fuel", "FUEL") {
        _mint(msg.sender, initialSupply);
        _setupDecimals(0);
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
        require(token.transferFrom(msg.sender, address(this), 1));
        _;
    }

    modifier createable() {
        require(token.transferFrom(msg.sender, address(this), 2));
        _;
    }

    constructor() {
        token = new FuelToken(25000000);
    }

    function transferToken() public {
        token.transfer(msg.sender, 10);
    }

    function createPost(string memory detail) public createable {
        Post memory newPost =
            Post({
                detail: detail,
                creator: msg.sender,
                createdTime: block.timestamp,
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

    function getPostsCount() public view returns (uint256) {
        return allPosts.length;
    }
}
