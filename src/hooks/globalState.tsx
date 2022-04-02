import { ethers } from "ethers";
import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { ConnectState } from "./useConnection";
import { Spot } from "./useGrid";

interface GlobalState {
    info: {
        grid: Array<Array<boolean>>;
        spots: Spot[];
    },
    connection: ConnectState;
}

const spots: Spot[] = [];
const grid: Array<Array<boolean>> = new Array(50); // grid with spotIDs
for (let i = 0; i < 50; i += 1) {
    grid[i] = new Array(50);
}

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
