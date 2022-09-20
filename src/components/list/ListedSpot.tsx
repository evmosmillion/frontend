import Link from "next/link";
import { CONTRACT_ADDRESS } from "../../hooks/contractInteraction";
import { SPACE_WIDTH } from "../home/Home";
import { OwnerInfo } from "./List";

const spacePerSpot = SPACE_WIDTH * SPACE_WIDTH;

type LinkFunction = (s: number) => JSX.Element;

const LINK_FN = (s: number) => <Link href={`/nft_#${s}`}><a>{s}</a></Link>;

const Addr = ({ address }: { address: string }) => <span title={address}>{address.slice(0, 5)}...{address.slice(-4)}</span>

export default function ListedSpot({ info }: { info: OwnerInfo }) {
    let linkFn = LINK_FN;
    return <tr>
        <td>
            <Addr address={info.address} />
        </td>
        <td>{(info.totalSpace * spacePerSpot).toLocaleString('en')}</td>
        <td>{info.tokenIds.length}</td>
        <td>
            {info.tokenIds.map<React.ReactNode>(linkFn).reduce((prev, curr) => [prev, ', ', curr])}
        </td>
    </tr>
}