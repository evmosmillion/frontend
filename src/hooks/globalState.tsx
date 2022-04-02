import { ethers } from "ethers";
import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { ConnectState } from "./useConnection";
import { Spot } from "./useGrid";

interface GlobalState {
    info: {
        grid: Array<Array<Spot|undefined>>;
        spots: Spot[];
    },
    connection: ConnectState;
}



// DEBUG INIT

const spots: Spot[] = [];

const grid: Array<Array<Spot|undefined>> = new Array(50); // grid with spotIDs
for (let i = 0; i < 50; i += 1) {
    grid[i] = new Array(50);
}

function addSpot(spot: Spot) {
    spots.push(spot);
    for(let i = 0; i < spot.width; i += 1) {
        for(let k = 0; k < spot.height; k += 1) {
            const otherSpot = grid[spot.x+i][spot.y+k];
            if (!otherSpot || otherSpot.bid < spot.bid) {
                grid[spot.x+i][spot.y+k] = spot;
            }
        }
    }
}

addSpot({
    owner: '0x23aa26115f513da1e8a146FC0288186D11088655',
    title: 'Hacker News',
    image: 'https://news.ycombinator.com/y18.gif',
    link: 'https://news.ycombinator.com/',
    x: 1,
    y: 1,
    width: 2,
    height: 2,
    bid: ethers.BigNumber.from('100000000000000000'),
    _index: 0,
});

addSpot({
    owner: '0x1927f54a4C9c293Fd45f4096b02c996C43FBFC51',
    title: 'Theta Labs',
    image: 'https://www.thetalabs.org/img/logos/theta-network.png',
    link: 'https://news.ycombinator.com/',
    x: 1,
    y: 3,
    width: 10,
    height: 5,
    bid: ethers.BigNumber.from('200000000000000000'),
    _index: 0,
});

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState<GlobalState>({
    info: {
        grid,
        spots,
    },
    connection: {
        status: 'disconnected',
    },
});

export { useGlobalState, setGlobalState, getGlobalState };
