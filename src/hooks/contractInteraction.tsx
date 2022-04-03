import { BigNumber, ethers } from "ethers";
import abi from "./abi";
import { getGlobalState, setGlobalState } from "./globalState";
import { addSpot, setSpotsCount, Spot, SpotPlace } from "./useGrid";

export const CONTRACT_ADDRESS = '0x1D45Aa0C3F7952A514077d2f5401A5325662eFc9';

function getContract() {
    const connection = getGlobalState('connection');
    if (connection.status !== 'connected') {
        throw new Error('Not connected');
    }
    const { provider } = connection;
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());
}

const contractInteraction = {

    buySpot: async (spot: Spot, value: BigNumber) => {
        // console.log('buying', spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link);
        const contract = getContract();
        await contract.buySpot(spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, { value });
    },

    updateSpot: async (spot: Spot) => {
        const contract = getContract();
        // console.log('UPDATE', spot);
        await contract.updateSpot(spot._index, spot.title, spot.image, spot.link);
    },

    gatherSpots: async () => {
        const provider = new ethers.providers.JsonRpcBatchProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        // const contract = getContract();
        const spotsLength = (await contract.getSpotsLength() as BigNumber).toNumber();
        setSpotsCount(spotsLength);

        // load the data in parallel
        for (let i = 0; i < spotsLength; i += 1) {
            contract.getSpot(i).then((spotWithOwner: any) => {
                addSpot({
                    x: spotWithOwner.spot.x,
                    y: spotWithOwner.spot.y,
                    width: spotWithOwner.spot.width,
                    height: spotWithOwner.spot.height,
                    title: spotWithOwner.spot.title,
                    image: spotWithOwner.spot.image,
                    link: spotWithOwner.spot.link,
                    nsfw: spotWithOwner.spot.nsfw,
                    owner: spotWithOwner.owner,
                    _index: i,
                });
            });
            // const spotWithOwner = await contract.getSpot(i);
            // addSpot({
            //     x: spotWithOwner.spot.x,
            //     y: spotWithOwner.spot.y,
            //     width: spotWithOwner.spot.width,
            //     height: spotWithOwner.spot.height,
            //     title: spotWithOwner.spot.title,
            //     image: spotWithOwner.spot.image,
            //     link: spotWithOwner.spot.link,
            //     nsfw: spotWithOwner.spot.nsfw,
            //     owner: spotWithOwner.owner,
            //     _index: i,
            // });
        }
    },
};

setTimeout(() => { // TODO put this into useEffect
    if (typeof window === 'undefined') {
        return;
    }
    // contractInteraction.gatherSpots();
}, 1);


export default contractInteraction;