import Link from "next/link";
import { CONTRACT_ADDRESS } from "../../hooks/contractInteraction";
import { SPACE_WIDTH } from "../home/Home";
import { OwnerInfo } from "./List";

const spacePerSpot = SPACE_WIDTH * SPACE_WIDTH;

type LinkFunction = (s: number) => JSX.Element;

const LINK_FN = (s: number) => <Link href={`/nft_#${s}`}><a>{s}</a></Link>;
const LINK_OPENTHETA = (s: number) => <a href={`https://beta.opentheta.io/nft/${CONTRACT_ADDRESS}/${s}`} target="_blank">{s}</a>;
const LINK_THETABOARD = (s: number) => <a href={`https://thetaboard.io/wallet/nft-info/${CONTRACT_ADDRESS}/${s}`} target="_blank">{s}</a>;

const addressInfo: {
    [adr: string]: {
        text: string,
        fn?: LinkFunction,
    }
} = {
    '0xbB5f35D40132A0478f6aa91e79962e9F752167EA': {
        text: 'OpenTheta',
        fn: LINK_OPENTHETA,
    },
    '0x533c8425897b3E10789C1d6F576b96Cb55E6F47d': {
        text: 'ThetaBoard',
        fn: LINK_THETABOARD,
    },
};

const Addr = ({ address }: { address: string }) => <span title={address}>{address.slice(0, 5)}...{address.slice(-4)}</span>

export default function ListedSpot({ info }: { info: OwnerInfo }) {
    let linkFn = addressInfo[info.address]?.fn ?? LINK_FN;
    return <tr>
        <td>
            <a href={`https://explorer.thetatoken.org/account/${info.address}`} target="_blank"><Addr address={info.address} /></a>
            
        </td>
        <td>
            {addressInfo[info.address]?.text}
        </td>
        <td>{(info.totalSpace * spacePerSpot).toLocaleString('en')}</td>
        <td>{info.tokenIds.length}</td>
        <td>
            {info.tokenIds.map<React.ReactNode>(linkFn).reduce((prev, curr) => [prev, ', ', curr])}
        </td>
    </tr>
}