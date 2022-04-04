
import Link from 'next/link';
import { CONTRACT_ADDRESS } from '../../hooks/contractInteraction';
import styles from './FAQ.module.scss';

export default function FAQ() {
    return <div id='faq' className={styles.faq}>
        <div className={styles.left}>
            <h2>What is this?</h2>
            <p>Remember the <a href="https://en.wikipedia.org/wiki/The_Million_Dollar_Homepage" target="_blank">The Million Dollar Homepage</a>? You could buy an ad spot for $1 per pixel. This is a smilar concept but decentralized on the Theta blockchain. You pay 1&nbsp;TFUEL (the currency on the network) for each pixel and your data is stored and loaded from the <a href="https://www.thetatoken.org/" target="_blank">Theta Blockchain</a>. This decentralized application (dApp) does not have a traditional server.</p>

            <h2>How does this work?</h2>
            <p>The smart contract <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">{CONTRACT_ADDRESS.slice(0, 5)}...{CONTRACT_ADDRESS.slice(-4)}</a> is responsible for storing and validating the data. When you buy a spot, the contract will check if the space is not already used by someone else and if you paid the correct amount of TFUEL. After paying the contract your data is stored on the blockchain. If you want to update the data you only have to pay for the costs of the transaction (called gas).</p>
            <p>Only you are able to control the data of your spot. In case you add vulgar or NSFW content, I might mark your spot as "NSFW" (on the frontend) though. Please just don't store that kind of data...</p>
            
            <h2>What happens when all spots are gone?</h2>
            <p>The space is limited. You can only buy spots in multiples of 20x20 pixels. That means in total there are only 50x50=2,500 spots available at maximum. After all spots are gone, the contract will not allow any new spots. But each spot comes with an NFT. That means you can transfer your spot or even sell it to others.</p>
        </div>
        <div className={styles.right}>
            <h2>Every spot is also an NFT!</h2>
            <p>The contract implements the NFT (Non-Fungible Token) Standard. That means every bought spot is also an NFT. By buying a spot you are actually creating/minting an NFT. The NFT contains information about where the spot is located in the image and other information. Only the owner of the NFT can change the content of the spot. When you transfer your NFT to someone else, that person gains control over the spot in the billboard above.</p>

            <p>If you want to see what the NFT looks like, check out this <Link href="/nft_#example">NFT example</Link>.</p>

            <h2>See it in action!</h2>
            <p>Here is a GIF that shows the buy and update process: TODO.</p>

            <h2>Source Code</h2>
            <ul>
                <li><a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">Github</a></li>
                <li><a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">Verified contract</a></li>
            </ul>
        </div>
    </div>
}