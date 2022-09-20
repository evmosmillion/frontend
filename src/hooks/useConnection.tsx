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

async function getProvider(silent: boolean) {
    if (typeof window === 'undefined') { // Otherwise Next.js might try to use this function server-side
        throw new Error('window not defined!');
    }
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
        if (!silent) {
            alert('You need the extension "MetaMask" to interact with this dApp.');
        }
        throw new Error('MetaMask is not installed.');
    }
    
    const provider = new ethers.providers.Web3Provider((globalThis as any).ethereum);
    const chainId = await provider.send('eth_chainId', []);

    if (chainId !== '0x2328') {
        if (!silent) {
            alert('Your Metamask extension is connected to the wrong chain. Make sure you are connected to the Theta Mainnet.');
        }
        throw new Error('Wrong chain connected.');
    }

    await provider.send('wallet_addEthereumChain', [{
        chainId: '0x2328',
        chainName: 'Evmos Testnet',
        nativeCurrency: { name: "tEVMOS", symbol: "tEVMOS", decimals: 18 },
        rpcUrls: ["https://eth.bd.evmos.dev:8545"],
        blockExplorerUrls: ["https://evm.evmos.dev/"],
    }]);

    return provider;
}

(async () => {
    try {
        const provider = await getProvider(true);
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
            const provider = await getProvider(false);

            const accounts = await provider.send('eth_requestAccounts', []) as string[];
            if (accounts.length === 0) {
                alert('Unable to connect to account. Make sure you are on the Theta Network and have an account.');
                return;
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