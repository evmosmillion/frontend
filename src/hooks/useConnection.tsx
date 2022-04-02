import { ethers } from 'ethers';
import { useEffect } from 'react';
import { setGlobalState, useGlobalState } from './globalState';

interface ConnectStateDisconnected {
    status: 'disconnected';
}
interface ConnectStateWaiting { // waiting for user to confirm
    status: 'waiting';
}
interface ConnectStateConnected { // waiting for user to confirm
    status: 'connected';
    provider: ethers.providers.Web3Provider;
    address: string;
    balance: number;
    balanceBigNumber: ethers.BigNumber;
}

export type ConnectState = ConnectStateDisconnected | ConnectStateWaiting | ConnectStateConnected;

async function getProvider() {
    if (typeof window === 'undefined') { // Otherwise Next.js might try to use this function server-side
        throw new Error('window not defined!');
    }
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
        throw new Error('MetaMask is not installed.');
    }
    
    const provider = new ethers.providers.Web3Provider((globalThis as any).ethereum);
    const chainId = await provider.send('eth_chainId', []);
    // if (chainId !== '0x169') {
    //     throw new Error('Wrong chain connected.');
    // }

    // await provider.send('wallet_addEthereumChain', [{
    //     chainId: '0x169',
    //     chainName: 'Theta Mainnet',
    //     nativeCurrency: { name: "Theta Fuel", symbol: "TFUEL", decimals: 18 },
    //     rpcUrls: ["https://eth-rpc-api.thetatoken.org/rpc"],
    //     blockExplorerUrls: ["https://explorer.thetatoken.org/"],
    // }]);

    // TESTNET
    if (chainId !== '0x16d') {
        throw new Error('Wrong chain connected.');
    }

    await provider.send('wallet_addEthereumChain', [{
        chainId: '0x16d',
        chainName: 'Theta Testnet',
        nativeCurrency: { name: "Theta Fuel", symbol: "TFUEL", decimals: 18 },
        rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
        blockExplorerUrls: ["https://testnet-explorer.thetatoken.org/"],
    }]);

    return provider;
}

(async () => {
    try {
        const provider = await getProvider();
        const accounts = await provider.send('eth_accounts', []) as string[]; // get accounts without requesting them via popup
        if (accounts.length !== 0) {
            const address = accounts[0].toLowerCase();
            const balance = await provider.getBalance(address);
            setGlobalState('connection', {
                status: 'connected',
                address,
                balance: parseFloat(ethers.utils.formatEther(balance)),
                balanceBigNumber: balance,
                provider,
            });
        }
    } catch (error: any) {
        // Don't do anything in case user is not connected, etc.
        // console.log('error', error);
    }
})();

export default function useConnection() {
    const [connection, setConnection] = useGlobalState('connection');

    async function connect() {
        try {
            setConnection({ status: 'waiting' });
            const provider = await getProvider();

            const accounts = await provider.send('eth_requestAccounts', []) as string[];
            if (accounts.length === 0) {
                throw new Error('Unable to connect to account');
            }
            const address = accounts[0].toLowerCase();
            const balance = await provider.getBalance(address);
            setConnection({
                status: 'connected',
                address,
                balance: parseFloat(ethers.utils.formatEther(balance)),
                balanceBigNumber: balance,
                provider,
            });
        } catch (error: any) { // Unable to connect, maybe show error message?
            console.log('error', error);
            setConnection({ status: 'disconnected' });
        }
    }

    return [connection, connect] as [ConnectState, () => void];
}