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
    }

    FuelToken public token;
    Post[] public allPosts;

    mapping(string => bool) hasFaucetUserId;
    mapping(address => bool) hasFaucetAddress;

    modifier createable() {
        require(token.transferFrom(msg.sender, address(this), 20));
        _;
    }

    modifier voteable() {
        require(token.transferFrom(msg.sender, address(this), 1));
        _;
    }

    constructor() {
        token = new FuelToken(25000000);
    }

    // Token Functionalities
    function transferToken(string memory userId) public {
        require(!hasFaucetUserId[userId], "User faucet already");
        require(!hasFaucetAddress[msg.sender], "User faucet already");

        token.transfer(msg.sender, 50);

        hasFaucetUserId[userId] = true;
        hasFaucetAddress[msg.sender] = true;
    }

    // Post Functionalities
    function createPost(string memory detail) public createable {
        Post memory newPost =
            Post({
                detail: detail,
                creator: msg.sender,
                createdTime: block.timestamp,
                flameCount: 20
            });

        allPosts.push(newPost);
    }

    function vote(bool upvote, uint256 indexOfPost) public voteable {
        Post storage post = allPosts[indexOfPost];
        require(post.flameCount != 0, "Post has no flames");

        if (upvote == true) {
            post.flameCount++;
        }

        if (upvote == false) {
            post.flameCount--;
        }
    }

    function withdraw(uint256 indexOfPost) public {
        Post storage post = allPosts[indexOfPost];

        token.transfer(msg.sender, post.flameCount);

        post.flameCount = 0;
    }

    function getPostsCount() public view returns (uint256) {
        return allPosts.length;
    }
}
