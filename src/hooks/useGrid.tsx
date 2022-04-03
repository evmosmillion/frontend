import { ethers } from "ethers";
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

    nsfw: boolean;

    // not provided by contract
    _index: number;
}

export function addSpot(spot: Spot) {
    const { spots, grid } = getGlobalState('info');
    spots.push(spot);
    for(let i = 0; i < spot.width; i += 1) {
        for(let k = 0; k < spot.height; k += 1) {
            const otherSpot = grid[spot.x+i][spot.y+k];
            grid[spot.x+i][spot.y+k] = true;
        }
    }
    setGlobalState('info', { spots: [...spots], grid });
}

export default function useGrid() {
    const [info, setInfo] = useGlobalState('info');

    // should later listend to blockchain and auto-download

    return info;
}