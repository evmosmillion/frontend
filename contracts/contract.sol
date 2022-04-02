// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;


contract ThetaBillboard {
    
    event BillboardBuy (
        uint indexed id,
        address owner,
        uint x,
        uint y,
        uint width,
        uint height
    );

    event BillboardChange (
        uint indexed id,
        string title,
        string image,
        string link,
        bool nsfw
    );

    event BillboardOwnerChange (
        uint indexed id,
        address from,
        address to
    );

    uint public constant weiPixelPrice = 100000; // 100000000000000000; // 0.1 Tfuel

    uint public constant pixelsPerCell = 400; // 20x20

    bool[50][50] public grid; // grid of taken spots

    // can withdraw the funds and set NSFW status of spots.
    address contractOwner;

    address payable withdrawWallet;

    struct Spot {
        address owner;
        uint8 x;
        uint8 y;
        uint8 width;
        uint8 height;
        string title;
        string image;
        string link;

        bool nsfw; // I will set this if necessary
    }

    Spot[] public spots;

    function getSpotsLength() public view returns (uint) {
        return spots.length;
    }

    constructor(address _contractOwner, address payable _withdrawWallet) {
        require(_contractOwner != address(0));
        require(_withdrawWallet != address(0));

        contractOwner = _contractOwner;
        withdrawWallet = _withdrawWallet;
    }

    function buySpot(uint8 _x, uint8 _y, uint8 _width, uint8 _height, string memory _title, string memory _image, string memory _link) public payable returns (uint id) {
        uint cost = _width * _height * pixelsPerCell * weiPixelPrice;
        require(cost > 0);
        require(msg.value >= cost);

        // Loop over relevant grid entries
        for(uint i = 0; i < _width; i++) {
            for(uint j = 0; j < _height; j++) {
                if (grid[_x + i][_y + j]) { // the spot is taken
                    revert("The spot is already taken.");
                }
                grid[_x + i][_y + j] = true;
            }
        }

        Spot memory spot = Spot(msg.sender, _x, _y, _width, _height, _title, _image, _link, false);
        spots.push(spot);
        id = spots.length - 1;

        emit BillboardBuy(id, msg.sender, _x, _y, _width, _height);

        return id;
    }

    function updateSpot(uint _id, string memory _title, string memory _image, string memory _link) public {
        Spot storage spot = spots[_id];
        require(msg.sender == spot.owner);
        spot.title = _title;
        spot.image = _image;
        spot.link = _link;

        emit BillboardChange(_id, spot.title, spot.image, spot.link, spot.nsfw);
    }

    function setSpotOwner(uint _id, address _newOwner) public {
        Spot storage spot = spots[_id];
        require(msg.sender == spot.owner);
        spot.owner = _newOwner;

        emit BillboardOwnerChange(_id, msg.sender, _newOwner);
    }


    // Set NSFW status for a specific spot.
    function setNsfw(uint _id, bool _nsfw) public {
        require(msg.sender == contractOwner);
        Spot storage spot = spots[_id];
        spot.nsfw = _nsfw;

        emit BillboardChange(_id, spot.title, spot.image, spot.link, spot.nsfw);
    }

    // withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        withdrawWallet.transfer(address(this).balance);
    }
}