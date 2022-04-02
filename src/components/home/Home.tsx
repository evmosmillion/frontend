import { useState } from 'react';
import { Rnd } from 'react-rnd';
import styles from './Home.module.scss';
import { ethers } from 'ethers';
import Tooltip from './Tooltip';
import useGrid, { Spot, SpotPlace } from '../../hooks/useGrid';
import useConnection from '../../hooks/useConnection';
import LoadingIndicator from './LoadingIndicator';
import contract from '../../hooks/contractInteraction';

const SPACE_WIDTH = 20;
const PRICE_STEP_STRING = '0.01';
const PRICE_STEP = ethers.utils.parseEther(PRICE_STEP_STRING);

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
interface TooltipContentProps {
    title: string;
    bid: ethers.BigNumber;
}
function TooltipContent({ title, bid }: TooltipContentProps) {
    return <div className={styles.tooltip}>
        <div><strong>{title || <em>No title</em>}</strong></div>
        <small>Paid {ethers.utils.formatEther(bid)} TFUEL per pixel</small>
    </div>;
}

export default function Home() {
    const { grid, spots } = useGrid();
    const [connection, connect] = useConnection();
    const [dim, setDim] = useState({
        x: 400,
        y: 100,
        width: 200,
        height: 200,
    });
    const [buying, setBuying] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(true);
    const [bidValue, setBidValue] = useState('0.01');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const hideInfo = () => setIsInfoVisible(false);
    const dragStop = (x: number, y: number) => {
        setDim({ ...dim, x, y });
        setIsInfoVisible(true);
    };

    const spot: SpotPlace = {
        x: Math.round(dim.x / SPACE_WIDTH),
        y: Math.round(dim.y / SPACE_WIDTH),
        width: Math.round(dim.width / SPACE_WIDTH),
        height: Math.round(dim.height / SPACE_WIDTH),
        bid: ethers.BigNumber.from('100000000000000000'),
    };

    let minPrice = PRICE_STEP;
    const overlappingSpots: Spot[] = [];
    if (buying && isInfoVisible) { // calculate minimal cost
        for(let i = 0; i < spot.width; i += 1) {
            for(let k = 0; k < spot.height; k += 1) {
                const otherSpot = grid[spot.x + i][spot.y + k];
                if (otherSpot && !overlappingSpots.includes(otherSpot)) {
                    overlappingSpots.push(otherSpot);
                    const oneUp = otherSpot.bid.add(PRICE_STEP);
                    minPrice = oneUp.gt(minPrice) ? oneUp : minPrice;
                }
            }
        }
    }
    const minValue = ethers.utils.formatEther(minPrice);
    let valueToShow = parseFloat(minValue) > parseFloat(bidValue) ? minValue : bidValue;

    const totalPixels = dim.width * dim.height;
    let totalCost = '-';
    const parsedValue = parseFloat(valueToShow);
    const weiValue = ethers.utils.parseEther(isNaN(parsedValue) ? '0' : valueToShow).mul(totalPixels);
    if (!isNaN(parsedValue)) {
        totalCost = ethers.utils.commify(ethers.utils.formatEther(weiValue));
    }

    let connectionContent: JSX.Element;
    if (connection.status === 'disconnected') {
        connectionContent = <button onClick={connect}>Connect to MetaMask wallet</button>;
    } else if (connection.status === 'waiting') {
        connectionContent = <LoadingIndicator width={100} height={50} />;
    } else if (buying) {
        connectionContent = <button onClick={() => setBuying(false)}>Hide spot</button>;
    } else {
        connectionContent = <button onClick={() => setBuying(true)}>Buy a spot!</button>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topbar}>
                <div className={styles.left}>
                    {connection.status === 'connected' && <>
                        Manage your spots: You don't own any spots yet.
                    </>}
                </div>
                <div className={styles.connect}>{connectionContent}</div>
                <div className={styles.right}>
                    {connection.status === 'connected' && <div className={styles.connected}>
                        <strong>Connected:</strong> {connection.address.slice(0, 5)}...{connection.address.slice(-5)}
                        <div className={styles.balance}>Balance: {connection.balance.toLocaleString('en', { maximumFractionDigits: 3 })} TFUEL</div>
                    </div>}
                </div>
            </div>
            <div className={styles.grid}>
                {spots.map((e, i) => <a key={i} href={e.link} target='_blank'><Tooltip content={<TooltipContent title={e.title} bid={e.bid} />} element='img' props={{
                    title: e.title,
                    src: e.image,
                    className: styles.cell,
                    style: {
                        left: `${e.x * SPACE_WIDTH}px`,
                        top: `${e.y * SPACE_WIDTH}px`,
                        width: `${e.width * SPACE_WIDTH}px`,
                        height: `${e.height * SPACE_WIDTH}px`,
                        zIndex: e.bid.toString(),
                        backgroundColor: '#' + e.owner.slice(-6),
                    },
                }} /></a>)}

                {buying && <>
                    <div className={`${styles.info} ${!isInfoVisible ? styles.hidden : ''}`} style={{
                        left: `${dim.x}px`,
                        top: `${dim.y + dim.height+20}px`,
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
                                    <th>Overlap:</th>
                                    <td>
                                        {overlappingSpots.length === 0
                                        ? '-'
                                        : <div>
                                            <ul className={styles.overlapping}>
                                                {overlappingSpots.map((spot, i) => <li key={i}>{spot.title.slice(0, 30)} @{ethers.utils.formatEther(spot.bid)} TFUEL/px</li>)}
                                            </ul>
                                            Minimal TFUEL/px: {minValue} TFUEL (highest overlap + {ethers.utils.formatEther(PRICE_STEP)})
                                        </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Bid/px:</th>
                                    <td>
                                        <input type="number" step={PRICE_STEP_STRING} min={PRICE_STEP_STRING} value={valueToShow} onChange={(ev) => setBidValue(ev.target.value)} /><br/>
                                    </td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td>
                                        <input type="range" min={PRICE_STEP_STRING} max={5} step={PRICE_STEP_STRING} value={valueToShow} onChange={(ev) => setBidValue(ev.target.value)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Total cost:</th>
                                    <td>{totalCost} TFUEL (+ gas)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><button onClick={() => contract.buySpot(spot, weiValue)}>Buy</button></td>
                                </tr>
                                {/*<tr>
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
                                    <th>NSFW?</th>
                                    <td><input type="checkbox" /></td>
                                </tr>*/}
                            </tbody>
                        </table>
                    </div>
                    <Rnd
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
                        {/*<img
                            title={title}
                            src={imageUrl}
                            className={styles.previewImage}
                            alt=''
                        />*/}
                    </Rnd>
                </>}
            </div>
        </div>
    )
}