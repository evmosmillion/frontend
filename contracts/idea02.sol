// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;


contract ThetaBillboard {

    event ThetaBillboardBuy(
        uint indexed idx,
        address owner,
        uint x,
        uint y,
        uint width,
        uint height
    );

    /// Publish is emitted whenever the contents of an ad is changed.
    event ThetaBillboardPublish(
        uint indexed idx,
        string link,
        string image,
        string title,
        bool NSFW
    );

    /// SetAdOwner is emitted whenever the ownership of an ad is transfered
    event SetAdOwner(
        uint indexed idx,
        address from,
        address to
    );

    uint public constant weiPixelPrice = 1; // 100000000000000000; // 0.1 Tfuel

    uint public constant pixelsPerCell = 400; // 20x20

    bool[50][50] public grid; // grid of taken spots

    // can withdraw the funds and override NSFW status of spots.
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

        bool nsfw;
        bool forceNsfw;
    }

    // ads are stored in an array, the id of an ad is its index in this array.
    Spot[] public spots;

    function getSpotsLength() public view returns (uint) {
        return spots.length;
    }

    constructor(address _contractOwner, address payable _withdrawWallet) {
        require(_contractOwner != address(0));
        require(_withdrawWallet != address(0));

        contractOwner = _contractOwner;
        withdrawWallet = _withdrawWallet;
        Spot memory spot = Spot(address(0), 0, 0, 0, 0, "Hi, there!", "", "https://google.com", false, false);
        spots.push(spot);
    }

    function buySpot(uint8 _x, uint8 _y, uint8 _width, uint8 _height, uint bid) public payable returns (uint spotIndex) {
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

        Spot memory spot = Spot(msg.sender, _x, _y, _width, _height, "", "", "", false, false);
        spots.push(spot);
        spotIndex = spots.length - 1;

        // TODO emit event

        return spotIndex;
    }

    function updateSpot(uint spotIndex, string memory _link, string memory _image, string memory _title, bool _nsfw) public {
        Spot storage spot = spots[spotIndex];
        require(msg.sender == spot.owner);
        spot.title = _title;
        spot.image = _image;
        spot.link = _link;
        spot.nsfw = _nsfw;

        // TODO emit event
        // Publish(_idx, ad.link, ad.image, ad.title, ad.NSFW || ad.forceNSFW);
    }

    function setAdOwner(uint spotIndex, address _newOwner) public {
        Spot storage spot = spots[spotIndex];
        require(msg.sender == spot.owner);
        spot.owner = _newOwner;

        // SetAdOwner(_idx, msg.sender, _newOwner);
    }


    // forceNSFW allows the owner to override the NSFW status for a specific ad unit.
    function forceNsfw(uint spotIndex, bool _nsfw) public {
        require(msg.sender == contractOwner);
        Spot storage spot = spots[spotIndex];
        spot.forceNsfw = _nsfw;

        // Publish(_idx, ad.link, ad.image, ad.title, ad.nsfw || ad.forceNsfw);
    }

    // withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        withdrawWallet.transfer(address(this).balance);
    }
}