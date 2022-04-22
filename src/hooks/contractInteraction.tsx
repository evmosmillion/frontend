import { BigNumber, ethers } from "ethers";
import abi from "./abi";
import { getGlobalState } from "./globalState";
import { updateSpot, setSpotsCount, Spot } from "./useGrid";
import pLimit from 'p-limit';

export const CONTRACT_ADDRESS = '0x5de7F81B6a19065464f023ae99942ce381b6c85E';

const staticProvider = new ethers.providers.JsonRpcBatchProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');

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

const PARALLEL_SPOT_DOWNLOADS = 10;
const spotGatherPlimit = pLimit(PARALLEL_SPOT_DOWNLOADS);

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
        // const DEMO_SPOTS = [{"x":35,"y":3,"width":4,"height":4,"title":"Hacker News","image":"https://news.ycombinator.com/y18.gif","link":"https://news.ycombinator.com/","nsfw":false,"owner":"0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F","_index":0},{"x":22,"y":4,"width":13,"height":4,"title":"Theta Wallet","image":"https://wallet.thetatoken.org/img/logo/theta_wallet_logo@2x.png","link":"https://wallet.thetatoken.org/","nsfw":false,"owner":"0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F","_index":1},{"x":11,"y":11,"width":13,"height":4,"title":"New Google Logo","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/155px-Google_2011_logo.png","link":"https://www.google.com/123","nsfw":false,"owner":"0x8ad096fe4c1011E66692A341dBC4eeA2718A916b","_index":2},{"x":0,"y":0,"width":3,"height":3,"title":"test","image":"https://s3.us-east-2.amazonaws.com/assets.thetatoken.org/tokens/theta.png","link":"asdf123","nsfw":false,"owner":"0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F","_index":3},{"x":9,"y":0,"width":3,"height":2,"title":"testasdf","image":"","link":"aaaaaaaaaa","nsfw":false,"owner":"0x8e9c3513B5F86811477fc1e21826Cebb4DBaD25F","_index":4}];
        // setSpotsCount(DEMO_SPOTS.length);
        // DEMO_SPOTS.forEach(e => updateSpot(e));

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, staticProvider);
        // const contract = getContract();
        const spotsLength = (await contract.getSpotsLength() as BigNumber).toNumber();
        setSpotsCount(spotsLength);

        // load the data in parallel
        for (let i = 0; i < spotsLength; i += 1) {
            spotGatherPlimit(async () => {
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
            });
        }
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