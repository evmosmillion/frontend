
import { ethers } from 'ethers';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import abi from '../../hooks/abi';
import { CONTRACT_ADDRESS } from '../../hooks/contractInteraction';
import LoadingIndicator from '../home/LoadingIndicator';
import styles from './Nft.module.scss';

const exampleUrl = 'http://localhost:4005/spot-37-11-9-8-5.json';

interface Metadata {
    isExample?: boolean;
    image: string;
    external_url: string;
    description: string;
    name: string;
    attributes: {
        trait_type: string;
        value: number;
    }[];
}

const staticProvider = new ethers.providers.JsonRpcBatchProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc');

export default function NftExample() {
    const [path, setPath] = useState('');
    const [metadata, setMetadata] = useState<Metadata | undefined>();
    const [owner, setOwner] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => { // register "#.." change, Next.js is unable to do that...
        if (typeof window === "undefined") {
            return;
        }
        setPath(window.location.href);
        const onHashChanged = () => {
            setError(false);
            setMetadata(undefined);
            setPath(window.location.href);
        };
        window.addEventListener("hashchange", onHashChanged);
        return () => window.removeEventListener("hashchange", onHashChanged);
    }, []);

    useEffect(() => {
        if (!path) {
            return;
        }
        const indexOfHash = path.indexOf('#');
        if (indexOfHash === -1) {
            return setError(true);
        }
        const part = path.slice(indexOfHash + 1);
        let edition: string;
        if (part === 'example') {
            edition = 'example';
        } else {
            if (isNaN(parseInt(part, 10))) {
                return setError(true);
            }
            edition = part;
        }
        (async () => {
            try {
                let url = exampleUrl;
                let owner = '0x0000000000000000000000000000000000000000';
                if (edition !== 'example') {
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, staticProvider);
                    [url, owner] = await Promise.all([
                        contract.tokenURI(edition),
                        contract.ownerOf(edition),
                    ]);
                    url = url.replace('https://nft.thetabillboard.com/', 'http://localhost:4005/');
                }
                const mdRequest = await fetch(url);
                const data = await mdRequest.json();
                if (edition === 'example') {
                    data.isExample = true;
                }
                setMetadata(data);
                setOwner(owner);
            } catch (err: any) {
                return setError(true);
            } // Just ignore errors with the blockchain -> this is when the NFT does not exist
        })();
    }, [path]);

    if (error) {
        return <div className={styles.container}>
            <h1>Unable to load NFT data</h1>
            <p>Either this NFT does not exist or there was an issue downloading the data.</p>
        </div>;
    }

    if (!metadata) {
        return <div className={styles.container}>
            <h1>Loading NFT data...</h1>
            <LoadingIndicator width={300} height={120} />
        </div>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ThetaBillboard.com NFT</title>
            </Head>
            <p><Link href="/">Show me the billboard</Link></p>
            <h1>{metadata.name}</h1>
            <p className={styles.nomargin}>{metadata.isExample
            ? <small>This is an example NFT.</small>
            : <small>TokenId <strong>{metadata.attributes.find(e => e.trait_type === 'edition')?.value}</strong> of contract <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">{CONTRACT_ADDRESS}</a></small>}</p>
            <p className={styles.nomargin}><small>Owned by <a href={`https://explorer.thetatoken.org/account/${owner}`} target="_blank">{owner}</a></small></p>

            <div className={styles.preview}>
                <div className={styles.image}>
                    <img src={metadata.image} />
                </div>
                <div className={styles.text}>
                    <h2>Metadata</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>name</th>
                                <td>{metadata.name}</td>
                            </tr>
                            <tr>
                                <th>description</th>
                                <td>{metadata.description}</td>
                            </tr>
                            <tr>
                                <th>image</th>
                                <td>{metadata.image}</td>
                            </tr>
                            <tr>
                                <th>external_url</th>
                                <td>{metadata.external_url}</td>
                            </tr>
                            <tr>
                                <th>attributes</th>
                                <td>
                                    <ul>
                                        {metadata.attributes.map(e =>
                                            <li key={e.trait_type}>{e.trait_type}: {e.value}</li>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}