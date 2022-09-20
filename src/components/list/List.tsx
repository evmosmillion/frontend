import Link from 'next/link';
import useGrid from '../../hooks/useGrid';
import { SPACE_WIDTH } from '../home/Home';
import baseStyles from '../home/Home.module.scss';
import LoadingIndicator from '../home/LoadingIndicator';
import styles from './List.module.scss';
import ListedSpot from './ListedSpot';

export interface OwnerInfo {
    address: string;
    tokenIds: number[];
    totalSpace: number;
}

export default function List() {
    let { grid, spots, receivedSpots, totalSpots, pixelsUsed, isGridLoading } = useGrid();

    const spaceByOwner: { [owner: string]: OwnerInfo } = {};

    if (isGridLoading) {
        return <div className={baseStyles.container}>
            <div className={styles.top}>
                <Link href="/">Back to the board!</Link>
                <h2>List of owners</h2>
                <div>Sorted by owned space. NFTs for sale link directly to the marketplace.</div>
            </div>
            <div>Loading: {receivedSpots}/{totalSpots}</div>
            <div><LoadingIndicator /></div>
        </div>;
    }

    for (let spot of spots) {
        if (!spaceByOwner[spot.owner]) {
            spaceByOwner[spot.owner] = {
                address: spot.owner,
                tokenIds: [],
                totalSpace: 0,
            };
        }
        const info = spaceByOwner[spot.owner];
        info.tokenIds.push(spot._index);
        info.totalSpace += spot.width * spot.height;
    }
    // map spaceByOwner to array
    const owners = Object.values(spaceByOwner);
    owners.sort((a, b) => b.totalSpace - a.totalSpace);
    for (const owner of owners) {
        if (owner.tokenIds.length > 1) {
            owner.tokenIds.sort((a, b) => (spots[b].width * spots[b].height) - (spots[a].width * spots[a].height));
        }
    }

    return (
        <div className={baseStyles.container}>
            <div className={styles.top}>
                <Link href="/">Back to the board!</Link>
                <h2>List of owners</h2>
                <div>Sorted by owned space. NFTs for sale link directly to the marketplace.</div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Total<br/> space</th>
                        <th>Number of<br/> NFTs</th>
                        <th>Owned NFTs (biggest spots first)</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map(e => <ListedSpot info={e} />)}
                </tbody>
            </table>
        </div>
    )
}