import { BigNumber, ethers } from "ethers";
import abi from "./abi";
import { getGlobalState, setGlobalState } from "./globalState";
import { addSpot, Spot, SpotPlace } from "./useGrid";

const CONTRACT_ADDRESS = '0x10d762d4881cDaEb220E1191342769D1B3B12fC1';

function getContract() {
    const connection = getGlobalState('connection');
    if (connection.status !== 'connected') {
        throw new Error('Not connected');
    }
    const { provider } = connection;
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());
}

async function num(value: any) {
    return (await value as ethers.BigNumber).toNumber();
}

const contractInteraction = {

    buySpot: async (spot: Spot, value: BigNumber) => {
        console.log('buying', spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link);
        const contract = getContract();
        await contract.buySpot(spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, { value });
    },

    updateSpot: async (spot: Spot) => {
        const contract = getContract();
        console.log('UPDATE', spot);
        await contract.updateSpot(spot._index, spot.title, spot.image, spot.link);
    },

    gatherSpots: async () => {
        const contract = getContract();
        const spotsLength = (await contract.getSpotsLength() as BigNumber).toNumber();
        for (let i = 0; i < spotsLength; i += 1) {
            const spotWithoutIndex = await contract.spots(i);
            const spot = { ...spotWithoutIndex, _index: i } as Spot;
            addSpot(spot);
        }
    },
};

setTimeout(() => {
    const connection = getGlobalState('connection');
    if (typeof window === 'undefined' || connection.status !== 'connected') {
        return;
    }
    contractInteraction.gatherSpots();
}, 1000);


export default contractInteraction;