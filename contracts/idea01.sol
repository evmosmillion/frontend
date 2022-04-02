// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;


contract OneMio {

    uint public constant priceSteps = 1; // 100000000000000000; // 0.1 Tfuel

    // Each grid cell is 20x20.
    uint public constant pixelsPerCell = 400;

    uint64[50][50] public grid; // IDs of spots
    uint64[] public activeSpots; // IDs of visible spots

    /// contractOwner can withdraw the funds and override NSFW status of ad units.
    address contractOwner;

    /// withdrawWallet is the fixed destination of funds to withdraw. It is
    /// separate from contractOwner to allow for a cold storage destination.
    address payable withdrawWallet;

    struct Spot {
        address owner;
        uint8 x;
        uint8 y;
        uint8 width;
        uint8 height;
        uint16 coveredArea;
        uint bid;
        string title;
        string image;
        string link;

        bool nsfw;
        bool forceNsfw;
        uint16 activeSpotsIndex;
    }

    /// ads are stored in an array, the id of an ad is its index in this array.
    Spot[] public spots;

    function spotsLength() public view returns (uint256) {
        return spots.length;
    }

    function activeSpotsLength() public view returns (uint256) {
        return activeSpots.length;
    }

    constructor() {
        // require(_contractOwner != address(0));
        // require(_withdrawWallet != address(0));

        // contractOwner = _contractOwner;
        withdrawWallet = payable(0); // _withdrawWallet;
        
        Spot memory spot = Spot(address(0), 0, 0, 0, 0, 0, 0, "Hi, there!", "", "https://google.com", false, false, 0);
        spots.push(spot);
    }

    event Info(
        uint test
    );

    function buySpot(uint8 _x, uint8 _y, uint8 _width, uint8 _height, uint bid) public payable returns (uint spotIndex) {
        uint16 coveredArea = uint16(_width) * uint16(_height);
        // uint cost = _width * _height * pixelsPerCell * bid;
        // require(bid > 0);
        // require(bid % priceSteps == 0);
        // require(msg.value >= cost);
        require(coveredArea > 0);

        Spot memory spot = Spot(msg.sender, _x, _y, _width, _height, coveredArea, bid, "", "", "", false, false, 0);
        spots.push(spot);
        spotIndex = spots.length - 1;

        activeSpots.push(uint64(spotIndex));
        uint activeSpotIndex = activeSpots.length - 1;
        spots[spotIndex].activeSpotsIndex = uint8(activeSpotIndex);

        // Loop over relevant grid entries
        for(uint i = 0; i < _width; i++) {
            for(uint j = 0; j < _height; j++) {
                if (grid[_x + i][_y + j] != 0) { // the spot is taken
                    Spot storage existingSpot = spots[grid[_x + i][_y + j]];
                    if (existingSpot.bid < bid) { // lower bid
                        removeOneAreaFromSpot(existingSpot);
                    } else {
                        revert("The spot is already taken by a higher bidder");
                    }
                }
                grid[_x + i][_y + j] = uint64(spotIndex);
            }
        }

        emit Info(spotIndex);

        return spotIndex;
    }

    function bumpUp(uint spotIndex, uint newBid) public payable {
        Spot storage spot = spots[spotIndex];

        require(msg.sender == spot.owner);
        require(newBid >= spot.bid);
        require(newBid % priceSteps == 0);

        uint16 coveredArea = uint16(spot.width) * uint16(spot.height);
        uint cost = coveredArea * pixelsPerCell * (newBid - spot.bid);
        require(msg.value >= cost);

        // check if spot is only in parts overlapping or completely gone
        if (activeSpots[spot.activeSpotsIndex] != spotIndex) {
            // this spot is not visible at all anymore, add it back to the activeSpots list
            activeSpots.push(uint64(spotIndex));
            uint activeSpotIndex = activeSpots.length - 1;
            spots[spotIndex].activeSpotsIndex = uint8(activeSpotIndex);
        }

        // Loop over relevant grid entries
        for(uint i = 0; i < spot.width; i++) {
            for(uint j = 0; j < spot.height; j++) {
                uint gridSpotIndex = grid[spot.x + i][spot.y + j];
                if (gridSpotIndex != 0) { // this part might be overlapping
                    if (gridSpotIndex != spotIndex) { // check if there is another spot there that is not our spot
                        Spot storage otherSpot = spots[gridSpotIndex];
                        if (otherSpot.bid < newBid) {
                            removeOneAreaFromSpot(otherSpot);
                        } else {
                            revert("Your bid is not high enough to take the spot.");
                        }
                    }
                }
            }
        }

        emit Info(spotIndex);
    }

    function removeOneAreaFromSpot(Spot storage spot) private {
        spot.coveredArea -= 1;
        if (spot.coveredArea == 0) {
            // remove spot from active spots
            activeSpots[spot.activeSpotsIndex] = activeSpots[activeSpots.length - 1];
            activeSpots.pop();
            spots[activeSpots[spot.activeSpotsIndex]].activeSpotsIndex = spot.activeSpotsIndex;
            // TODO event -> removed
        }
    }

    function updateSpot(uint spotIndex, string memory _link, string memory _image, string memory _title, bool _nsfw) public {
        Spot storage spot = spots[spotIndex];
        require(msg.sender == spot.owner);
        spot.title = _title;
        spot.image = _image;
        spot.link = _link;
        spot.nsfw = _nsfw;

        // Publish(_idx, ad.link, ad.image, ad.title, ad.NSFW || ad.forceNSFW);
    }

    function setAdOwner(uint spotIndex, address _newOwner) public {
        Spot storage spot = spots[spotIndex];
        require(msg.sender == spot.owner);
        spot.owner = _newOwner;

        // SetAdOwner(_idx, msg.sender, _newOwner);
    }


    /// forceNSFW allows the owner to override the NSFW status for a specific ad unit.
    function forceNsfw(uint spotIndex, bool _nsfw) public {
        require(msg.sender == contractOwner);
        Spot storage spot = spots[spotIndex];
        spot.forceNsfw = _nsfw;

        // Publish(_idx, ad.link, ad.image, ad.title, ad.nsfw || ad.forceNsfw);
    }

    /// withdraw allows the owner to transfer out the balance of the contract.
    function withdraw() public {
        require(msg.sender == contractOwner);
        withdrawWallet.transfer(address(this).balance);
    }
}