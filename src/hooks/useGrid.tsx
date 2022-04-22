import { ethers } from "ethers";
import { SPACE_WIDTH } from "../components/home/Home";
import { getGlobalState, setGlobalState, useGlobalState } from "./globalState";

export interface SpotPlace {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Spot extends SpotPlace {
    owner: string;
    title: string;
    image: string;
    link: string;
    // not provided by contract
    _index: number;
}

export function setSpotsCount(spotCount: number) {
    const info = getGlobalState('info');
    setGlobalState('info', { ...info, totalSpots: spotCount });
}

export function updateSpot(spot: Spot) {
    let { spots, grid, receivedSpots, pixelsUsed, totalSpots, isGridLoading } = getGlobalState('info');
    if (!spots[spot._index]) {
        receivedSpots += 1;
        pixelsUsed += (spot.height * spot.width) * (SPACE_WIDTH * SPACE_WIDTH);
        if (receivedSpots > totalSpots) { // in case an update adds a spot later
            totalSpots = receivedSpots;
        }
    }
    spots[spot._index] = spot;
    for(let i = 0; i < spot.width; i += 1) {
        for(let k = 0; k < spot.height; k += 1) {
            grid[spot.x+i][spot.y+k] = true;
        }
    }
    setGlobalState('info', { spots: [...spots], grid, receivedSpots, pixelsUsed, totalSpots, isGridLoading });
}

export default function useGrid() {
    const [info, setInfo] = useGlobalState('info');

    // should later listend to blockchain and auto-download

    return info;
}