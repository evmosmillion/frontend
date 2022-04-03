import { useState } from 'react';
import { Rnd } from 'react-rnd';
import styles from './Home.module.scss';
import { ethers } from 'ethers';
import Tooltip from './Tooltip';
import useGrid, { Spot, SpotPlace } from '../../hooks/useGrid';
import useConnection from '../../hooks/useConnection';
import LoadingIndicator from './LoadingIndicator';
import contract from '../../hooks/contractInteraction';
import Spots from './Spots';
import FAQ from './FAQ';

export const SPACE_WIDTH = 20;
const PRICE_STRING = '1';
const PRICE_WEI = ethers.utils.parseEther(PRICE_STRING);

function resizeStyle(top?: number, right?: number, bottom?: number, left?: number) {
    return {
        top: top ? (top * -8) + 'px' : undefined,
        right: right ? (right * -8) + 'px' : undefined,
        bottom: bottom ? (bottom * -8) + 'px' : undefined,
        left: left ? (left * -8) + 'px' : undefined,
        width: '8px',
        height: '8px',
    }
}

export default function Home() {
    const { grid, spots, receivedSpots, totalSpots, pixelsUsed } = useGrid();
    const [connection, connect] = useConnection();
    const [dim, setDim] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [buying, setBuying] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(true);
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    const hideInfo = () => setIsInfoVisible(false);
    const dragStop = (x: number, y: number) => {
        setDim({ ...dim, x, y });
        setIsInfoVisible(true);
    };

    const spot: Spot = {
        x: Math.round(dim.x / SPACE_WIDTH),
        y: Math.round(dim.y / SPACE_WIDTH),
        width: Math.round(dim.width / SPACE_WIDTH),
        height: Math.round(dim.height / SPACE_WIDTH),
        title,
        image: imageUrl,
        link: linkUrl,
        nsfw: false,
        owner: connection.status === 'connected' ? connection.address : '-',
        _index: editIndex,
    };

    let isOverlapping = false;
    if (buying && isInfoVisible) { // calculate minimal cost
        for (let i = 0; i < spot.width; i += 1) {
            for (let k = 0; k < spot.height; k += 1) {
                if (grid[spot.x + i][spot.y + k]) {
                    isOverlapping = true;
                    break;
                }
            }
        }
    }
    const totalPixels = dim.width * dim.height;
    const weiValue = PRICE_WEI.mul(totalPixels);
    const costText = ethers.utils.commify(ethers.utils.formatEther(weiValue).slice(0, -2)); // slice removes the '.0' at the end
    let enoughFunds = false;
    
    let mySpots: Spot[] = [];
    if (connection.status === 'connected') {
        const myAddress = connection.address.toLowerCase();
        mySpots = spots.filter(s => s.owner.toLowerCase() === myAddress);
        enoughFunds = connection.balanceBigNumber.gte(weiValue);
    }

    function selectSpot(idStr: string) {
        if (idStr === '-1') { // unset
            setTitle('');
            setImageUrl('');
            setLinkUrl('');
            setEditIndex(-1);
            return;
        }
        const index = parseInt(idStr, 10);
        const spot = spots.find(s => s._index === index);
        if (!spot) {
            return;
        }
        setBuying(false);
        setDim({ x: spot.x * SPACE_WIDTH, y: spot.y * SPACE_WIDTH, width: spot.width * SPACE_WIDTH, height: spot.height * SPACE_WIDTH });
        setTitle(spot.title);
        setImageUrl(spot.image);
        setLinkUrl(spot.link);
        setEditIndex(index);
    }

    function buy() {
        setDim({
            x: 400,
            y: 100,
            width: 200,
            height: 200,
        });
        setTitle('');
        setImageUrl('');
        setLinkUrl('');
        setEditIndex(-1);
        setBuying(true);
    }

    let connectionContent: JSX.Element;
    if (connection.status === 'disconnected') {
        connectionContent = <button onClick={connect}>Connect to MetaMask wallet</button>;
    } else if (connection.status === 'waiting') {
        connectionContent = <LoadingIndicator width={100} height={50} />;
    } else if (buying) {
        connectionContent = <button onClick={() => setBuying(false)}>Cancel</button>;
    } else {
        connectionContent = <button onClick={buy}>Place a spot!</button>;
    }

    const isEditing = (editIndex !== -1);

    let spotInfo: JSX.Element | string;
    if (totalSpots === -1) {
        spotInfo = 'Loading information from blockchain...';
    } else if (receivedSpots === totalSpots) {
        spotInfo = <>Available: {(1_000_000 - pixelsUsed).toLocaleString('en')} pixels / Sold: {pixelsUsed.toLocaleString('en')} pixels</>;
    } else {
        spotInfo = `Downloading spots... ${receivedSpots}/${totalSpots}`;
    }

    let connectInfo: JSX.Element;
    if (connection.status === 'connected') {
        connectInfo = <div className={styles.connected}>
            <strong>Connected:</strong> {connection.address.slice(0, 5)}...{connection.address.slice(-5)}
            <div className={styles.balance}>Balance: {connection.balance.toLocaleString('en', { maximumFractionDigits: 3 })} TFUEL</div>
        </div>
    } else {
        connectInfo = <div className={styles.explain}>
            <h1>Theta Billboard</h1>
            1,000,000 pixels for sale. 1 TFUEL per pixel.<br />
            Data is stored in the Theta blockchain. <a href="#faq">More info</a>
        </div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.topbar}>
                <div className={styles.left}>
                    <div>{spotInfo}</div>
                    {connection.status === 'connected' && <div className={styles.manage}>
                        Manage your spots: {mySpots.length === 0
                        ? "You don't own any spots yet."
                        : <select size={1} onChange={(ev) => selectSpot(ev.target.value)} value={editIndex}>
                            <option value={-1}>Select spot</option>
                            {mySpots.map(s => <option value={s._index} key={s._index}>
                                {s.width * SPACE_WIDTH}x{s.height * SPACE_WIDTH} at ({s.x * SPACE_WIDTH},{s.y * SPACE_WIDTH})
                            </option>)}
                        </select>}
                    </div>}
                </div>
                <div className={styles.connect}>{connectionContent}</div>
                <div className={styles.right}>{connectInfo}</div>
            </div>
            <div className={styles.grid}>
                <Spots
                    spots={spots}
                    editIndex={editIndex}
                    editImageUrl={isEditing ? imageUrl : ''}
                    editLinkUrl={isEditing ? linkUrl : ''}
                    editTitle={isEditing ? title : ''}
                />

                {(buying || isEditing) && <div className={`${styles.info} ${!isInfoVisible ? styles.hidden : ''} ${isEditing ? styles.editing : ''}`} style={{
                    left: `${Math.min(dim.x, 600)}px`,
                    top: dim.y < 500 ? `${dim.y + dim.height + 20}px` : undefined,
                    bottom: dim.y >= 500 ? `${1000 - dim.y + 20}px` : undefined,
                }}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Size:</th>
                                <td>{dim.width}x{dim.height}</td>
                            </tr>
                            <tr>
                                <th>Position:</th>
                                <td>{dim.x},{dim.y}</td>
                            </tr>
                            <tr>
                                <th>Total:</th>
                                <td>{totalPixels.toLocaleString('en')} Pixels</td>
                            </tr>
                            <tr>
                                <th>Cost:</th>
                                <td>{ isEditing ? 'You only pay for gas to update the content.' : `${costText} TFUEL (+ gas)`}</td>
                            </tr>
                            <tr className={styles.lineAbove}>
                                <th>Title:</th>
                                <td><input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} /></td>
                            </tr>
                            <tr>
                                <th>Image URL:</th>
                                <td><input type="text" value={imageUrl} onChange={(ev) => setImageUrl(ev.target.value)} /></td>
                            </tr>
                            <tr>
                                <th>Link URL:</th>
                                <td><input type="text" value={linkUrl} onChange={(ev) => setLinkUrl(ev.target.value)} /></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>You can change these values anytime for free (only gas costs).</td>
                            </tr>
                        </tbody>
                    </table>
                    {isEditing
                    ? <><button onClick={() => contract.updateSpot(spot)}>Update</button><button onClick={() => selectSpot('-1')}>Cancel</button></>
                    : (isOverlapping
                        ? <div className={styles.belowTable}>You cannot buy this spot. <br />You are overlapping other spots!</div>
                        : (enoughFunds
                            ? <button onClick={() => contract.buySpot(spot, weiValue)}>Buy</button>
                            : <div className={styles.belowTable}>You cannot buy this spot. <br />You don't have enough funds to buy this spot!</div>)
                        )
                    }
                </div>}
                {buying && <Rnd
                    onDragStart={hideInfo}
                    className={styles.draggable}
                    size={dim}
                    position={dim}
                    onDragStop={(e, d) => dragStop(d.lastX, d.lastY)}
                    onResize={(e, direction, ref, delta, position) => {
                        setDim({
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position,
                        });
                    }}
                    style={{
                        backgroundColor: connection.status === 'connected' ? `#${connection.address.slice(-6)}`: '3c3c3c',
                    }}
                    resizeGrid={[20, 20]}
                    dragGrid={[20, 20]}
                    minHeight={20}
                    minWeight={20}
                    bounds='parent'
                    title={title}
                    resizeHandleStyles={{
                        topRight: resizeStyle(1, 1, 0, 0),
                        bottomRight: resizeStyle(0, 1, 1, 0),
                        bottomLeft: resizeStyle(0, 0, 1, 1),
                        topLeft: resizeStyle(1, 0, 0, 1),
                    }}
                    resizeHandleClasses={{
                        // top: styles.resizeHandle,
                        topRight: styles.resizeHandle,
                        // right: styles.resizeHandle,
                        bottomRight: styles.resizeHandle,
                        // bottom: styles.resizeHandle,
                        bottomLeft: styles.resizeHandle,
                        // left: styles.resizeHandle,
                        topLeft: styles.resizeHandle,
                    }}
                >
                    <Tooltip content={title} props={{
                        className: styles.previewbox
                    }}>
                        <img
                            src={imageUrl}
                            className={styles.previewImage}
                            alt=''
                        />
                    </Tooltip>
                </Rnd>}
            </div>
            <FAQ />
        </div>
    )
}