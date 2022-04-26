import { BigNumber, ethers } from "ethers";
import abi from "./abi";
import { getGlobalState, setGlobalState } from "./globalState";
import { updateSpot, setSpotsCount, Spot } from "./useGrid";
import devData from "./devData";

// export const CONTRACT_ADDRESS = '0x038BB06C2224151151f07D15b8A1A8bBAe49fd07'; // testnet
export const CONTRACT_ADDRESS = '0xe45610E578d4eb626121f55A61aB346A619B7d99';

// const staticProvider = new ethers.providers.JsonRpcBatchProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');
const staticProvider = new ethers.providers.JsonRpcBatchProvider('https://eth-rpc-api.thetatoken.org/rpc');

function getMetamaskContract() {
    const connection = getGlobalState('connection');
    if (connection.status !== 'connected') {
        throw new Error('Not connected');
    }
    const { provider } = connection;
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());
}

const EVENT_ABI = 'ThetaMillionPublish(uint256,address,uint8,uint8,uint8,uint8,string,string,string,bool)';
const ABI_DECODE = ['uint8','uint8','uint8','uint8','string','string','string','bool'];

function waitForEvent() {
    const connection = getGlobalState('connection');
    if (connection.status !== 'connected') {
        return;
    }
    return new Promise<void>(async (resolve) => {
        const filter = {
            address: CONTRACT_ADDRESS,
            topics: [ethers.utils.id(EVENT_ABI)],
        };
        const currentHeight = await staticProvider.getBlockNumber();
        staticProvider.on(
            filter,
            (log) => { // executed if event gets caught example loading ends
                const [tokenId] = ethers.utils.defaultAbiCoder.decode(['uint256'], log.topics[1]) as [ethers.BigNumber];
                const [owner] = ethers.utils.defaultAbiCoder.decode(['address'], log.topics[2]) as [string];
                const [x, y, width, height, title, image, link, updated] = ethers.utils.defaultAbiCoder.decode(ABI_DECODE, log.data) as [number, number, number, number, string, string, string, boolean];
                const spot: Spot = {
                    x, y, width, height, title, image, link, owner,
                    _index: tokenId.toNumber(),
                };
                updateSpot(spot);
                if (owner.toLowerCase() === connection.address.toLowerCase() && log.blockNumber >= currentHeight) {
                    staticProvider.off(filter);
                    resolve();
                }
            }
        );
    });
}

const contractInteraction = {

    buySpot: async (spot: Spot, value: BigNumber) => {
        try {
            const contract = getMetamaskContract();
            await contract.buySpot(spot.x, spot.y, spot.width, spot.height, spot.title, spot.image, spot.link, { value });
            await waitForEvent();
        } catch (error: any) {
            console.log('Error', error);
        }
    },

    updateSpot: async (spot: Spot) => {
        try {
            const contract = getMetamaskContract();
            await contract.updateSpot(spot._index, spot.title, spot.image, spot.link);
            await waitForEvent();
        } catch (error: any) {
            console.log('Error', error);
        }
    },

    gatherSpots: async () => {
        // const DEMO_SPOTS = devData;
        // setSpotsCount(DEMO_SPOTS.length);
        // DEMO_SPOTS.forEach(e => updateSpot(e));
        // setGlobalState('info', { ...getGlobalState('info'), isGridLoading: false });

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, staticProvider);
        const spotsLength = 571; // (await contract.getSpotsLength() as BigNumber).toNumber();
        setSpotsCount(spotsLength);

        // load the data in parallel
        let doneCount = 0;
        for (let i = 0; i < spotsLength; i += 1) {
            if (i % 50 === 0 && i !== 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            (async (i) => {
                const spotWithOwner = await contract.getSpot(i);
                updateSpot({
                    x: spotWithOwner.spot.x,
                    y: spotWithOwner.spot.y,
                    width: spotWithOwner.spot.width,
                    height: spotWithOwner.spot.height,
                    title: spotWithOwner.spot.title,
                    image: spotWithOwner.spot.image,
                    link: spotWithOwner.spot.link,
                    owner: spotWithOwner.owner,
                    _index: i,
                });
                doneCount += 1;
                if (doneCount === spotsLength) {
                    const info = getGlobalState('info');
                    // console.log(JSON.stringify(info.spots));
                    setGlobalState('info', { ...info, isGridLoading: false });
                }
            })(i);
        }
        // if (spotsLength === 0) {
        //     const info = getGlobalState('info');
        //     setGlobalState('info', { ...info, isGridLoading: false });
        // }
    },

    withdraw: async () => {
        const contract = getMetamaskContract();
        contract.withdraw();
    }
};

// setTimeout(() => {
//     contractInteraction.withdraw();
// }, 1000);


export default contractInteraction;