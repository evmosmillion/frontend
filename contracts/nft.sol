// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";

contract OneMio721 is ERC721 {

    constructor(address payable _contractOwner) ERC721("EvmosMillion", "EM") {
        require(_contractOwner != address(0));
        contractOwner = _contractOwner;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://nft.evmosmillion.com/spot";
    }

    function tokenURI(uint tokenId) public view override returns (string memory) {
        Spot storage spot = spots[tokenId];
        return string(abi.encodePacked(
            _baseURI(),
            "-", Strings.toString(tokenId),
            "-", Strings.toString(spot.x),
            "-", Strings.toString(spot.y),
            "-", Strings.toString(spot.width),
            "-", Strings.toString(spot.height),
            ".json"
        ));
    }

    event EvmosMillionPublish (
        uint indexed id,
        address indexed owner,
        uint8 x,
        uint8 y,
        uint8 width,
        uint8 height,
        string title,
        string image,
        string link,
        bool update
    );

    uint public constant cellBasePrice = 1;
    uint public constant cellBaseIncrement = 1;
    uint public cellsSold = 0;

    bool[50][50] public grid; // grid of taken spots

    // can withdraw the funds
    address payable contractOwner;

    struct Spot {
        uint8 x;
        uint8 y;
        uint8 width;
        uint8 height;
        string title;
        string image;
        string link;
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

    function getMultipleSpots(uint count, uint offset) public view returns (SpotWithOwner[] memory spotInfos) {
        uint max = ((offset + count) > spots.length) ? spots.length : (offset + count);
        
        spotInfos = new SpotWithOwner[](count);
        for (uint i = offset; i < max;) {
            Spot storage spot = spots[i];
            spotInfos[i - offset] = SpotWithOwner(spot, ERC721.ownerOf(i));
            unchecked{ i++; }
        }
    }

    function buySpot(uint8 x, uint8 y, uint8 width, uint8 height, string memory title, string memory image, string memory link) public payable returns (uint tokenId) {
        uint cellCost = cellBasePrice + (cellBaseIncrement * (cellsSold / 250));
        uint cellSize = uint256(width) * uint256(height);
        uint cost = cellSize * cellCost;

        require(cost > 0);
        require(msg.value >= cost);
        require(bytes(title).length < 200);
        require(bytes(image).length < 1000);
        require(bytes(link).length < 1000);

        // Loop over relevant grid entries
        for(uint i = 0; i < width; ) {
            for(uint k = 0; k < height; ) {
                if (grid[x + i][y + k]) { // the spot is taken
                    revert("The spot is already taken.");
                }
                grid[x + i][y + k] = true;
                unchecked{ k++; }
            }
            unchecked{ i++; }
        }

        Spot memory spot = Spot(x, y, width, height, title, image, link);
        spots.push(spot);
        tokenId = spots.length - 1;

        cellsSold += cellSize;
        
        _mint(msg.sender, tokenId);

        emit EvmosMillionPublish(tokenId, msg.sender, x, y, width, height, title, image, link, false);

        return tokenId;
    }

    function updateSpot(uint tokenId, string memory title, string memory image, string memory link) public {
        require(msg.sender == ERC721.ownerOf(tokenId));
        Spot storage spot = spots[tokenId];
        spot.title = title;
        spot.image = image;
        spot.link = link;

        emit EvmosMillionPublish(tokenId, msg.sender, spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, true);
    }

    // withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        contractOwner.transfer(address(this).balance);
    }

}
