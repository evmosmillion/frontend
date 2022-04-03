// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";

contract OneMio721 is ERC721 {

    constructor(/*address contractOwner, address payable withdrawWallet*/) ERC721("MyToken", "TBB") {
        // require(contractOwner != address(0));
        // require(withdrawWallet != address(0));
        
        contractOwner = address(0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F); // contractOwner;
        withdrawWallet = payable(0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:3005/nft/spot";
    }

    function tokenURI(uint tokenId) public view override returns (string memory) {
        Spot storage spot = spots[tokenId];
        return string(abi.encodePacked(
            _baseURI(),
            "-", Strings.toString(spot.x),
            "-", Strings.toString(spot.y),
            "-", Strings.toString(spot.width),
            "-", Strings.toString(spot.height),
            ".json"
        ));
    }

    event BillboardPublish (
        uint indexed id,
        address indexed owner,
        uint x,
        uint y,
        uint width,
        uint height,
        string title,
        string image,
        string link,
        bool nsfw
    );

    uint public constant weiPixelPrice = 100000; // 100000000000000000; // 0.1 Tfuel

    uint public constant pixelsPerCell = 400; // 20x20

    bool[50][50] public grid; // grid of taken spots

    // can withdraw the funds and set NSFW status of spots.
    address contractOwner;

    address payable withdrawWallet;

    struct Spot {
        // address owner;
        uint8 x;
        uint8 y;
        uint8 width;
        uint8 height;
        string title;
        string image;
        string link;

        bool nsfw; // I will set this if necessary
    }
    struct SpotWithOwner {
        Spot spot;
        address owner;
    }

    Spot[] public spots;

    function getSpot(uint tokenId) public view returns (SpotWithOwner memory spotInfo) {
        Spot storage spot = spots[tokenId];
        spotInfo = SpotWithOwner(spot, ERC721.ownerOf(tokenId));
        return spotInfo;
    }

    function getSpotsLength() public view returns (uint) {
        return spots.length;
    }

    function buySpot(uint8 x, uint8 y, uint8 width, uint8 height, string memory title, string memory image, string memory link) public payable returns (uint tokenId) {
        uint cost = width * height * pixelsPerCell * weiPixelPrice;
        require(cost > 0);
        require(msg.value >= cost);

        // Loop over relevant grid entries
        for(uint i = 0; i < width; i++) {
            for(uint j = 0; j < height; j++) {
                if (grid[x + i][y + j]) { // the spot is taken
                    revert("The spot is already taken.");
                }
                grid[x + i][y + j] = true;
            }
        }

        Spot memory spot = Spot(x, y, width, height, title, image, link, false);
        spots.push(spot);
        tokenId = spots.length - 1;
        
        _mint(msg.sender, tokenId);

        emit BillboardPublish(tokenId, msg.sender, x, y, width, height, title, image, link, false);

        return tokenId;
    }

    function updateSpot(uint tokenId, string memory title, string memory image, string memory link) public {
        require(msg.sender == ERC721.ownerOf(tokenId));
        Spot storage spot = spots[tokenId];
        spot.title = title;
        spot.image = image;
        spot.link = link;

        emit BillboardPublish(tokenId, msg.sender, spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, spot.nsfw);
    }

    // Set NSFW status for a specific spot.
    function setNsfw(uint tokenId, bool nsfw) public {
        require(msg.sender == contractOwner);
        Spot storage spot = spots[tokenId];
        spot.nsfw = nsfw;

        emit BillboardPublish(tokenId, ERC721.ownerOf(tokenId), spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, spot.nsfw);
    }

    // withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        withdrawWallet.transfer(address(this).balance);
    }

}
