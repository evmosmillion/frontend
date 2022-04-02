import { BigNumber, ethers } from "ethers";
import abi from "./abi";
import { getGlobalState, setGlobalState } from "./globalState";
import { addSpot, Spot, SpotPlace } from "./useGrid";

const CONTRACT_ADDRESS = '0xa3ff96bb97cc4cf2e7ea608c663ec87ad773a245';

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
    buySpot: async (spot: SpotPlace, value: BigNumber) => {
        const contract = getContract();
        console.log('buy', value.toString());
        const a = await contract.buySpot(spot.x, spot.y, spot.width, spot.height, spot.bid, {
            value: ethers.utils.parseEther('0.00000001'),
        });
        console.log('a', a);
    },

    gatherSpots: async () => {
        const contract = getContract();
        const activeSpotsLength = await num(contract.activeSpotsLength());
        for (let i = 0; i < activeSpotsLength; i += 1) {
            const spotIndex = await num(contract.activeSpots(i));
            const spotWithoutIndex = await contract.spots(spotIndex);
            const spot = { ...spotWithoutIndex, _index: spotIndex } as Spot;
            addSpot(spot);
            // setTimeout(() => {
            //     spot.title = 'Hacker News';
            //     spot.image = 'https://news.ycombinator.com/y18.gif';
            //     spot.link = 'https://news.ycombinator.com/';
            //     contractInteraction.updateSpot(spot);
            // }, 1000);
        }
    },

    updateSpot: async (spot: Spot) => {
        const contract = getContract();
        console.log('spot', spot);
        const result = await contract.updateSpot(spot._index, spot.link, spot.image, spot.title, /*spot.nsfw*/ false);
        console.log('result', result);
    }
};

setTimeout(() => {
    // contractInteraction.gatherSpots();
}, 1000);


export default contractInteraction;