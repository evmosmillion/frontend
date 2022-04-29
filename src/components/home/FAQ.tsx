
import Link from 'next/link';
import { CONTRACT_ADDRESS } from '../../hooks/contractInteraction';
import styles from './FAQ.module.scss';

export default function FAQ() {
    return <div id='faq' className={styles.faq}>
        <div className={styles.left}>
            <h2>What is this?</h2>
            <p>Remember the <a href="https://en.wikipedia.org/wiki/The_Million_Dollar_Homepage" target="_blank">Million Dollar Homepage</a>? You could buy an ad spot for $1 per pixel. This is a smilar concept but decentralized on the Theta blockchain. You pay 1&nbsp;TFUEL (the currency on the network) for each pixel and your data is stored and loaded from the <a href="https://www.thetatoken.org/" target="_blank">Theta Blockchain</a>. This decentralized application (dApp) does not have a traditional server.</p>

            <h2>How does this work?</h2>
            <p>The smart contract <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">{CONTRACT_ADDRESS.slice(0, 5)}...{CONTRACT_ADDRESS.slice(-4)}</a> is responsible for storing and validating the data. When you buy a spot, the contract will check if the space is not already used by someone else and if you paid the correct amount of TFUEL. After paying the contract your data is stored on the blockchain. If you want to update the data you only have to pay for the costs of the transaction (called gas).</p>
            <p>Only you are able to control the data of your spot. In case you add vulgar or NSFW content, I might mark your spot as "NSFW" (on the frontend) though. Please just don't store that kind of data...</p>
            
            <h2><span className={styles.del}>What happens when all spots are gone?</span> All spots are gone!</h2>
            <p>I announced this project on April, 22nd 2022 on <a href="https://twitter.com/ThomasOnTheta/status/1517578500953329666" target="_blank">Twitter</a>. Thanks to all participants, the board filled up in only four days. The space was limited. You could only get spots in multiples of 20x20 pixels. That means in total there were only 50x50=2,500 spots available at maximum. All spots are taking now. 571 spots were created and the contract won't allow new spots. But each spot comes with an NFT. That means you can transfer your spot or even <a href="https://beta.opentheta.io/collection/thetamillion" target="_blank">sell it to others</a>.</p>

            <h2>How can I get a spot now?</h2>
            <p>You can try to buy a spot from someone. Each spot is wrapped as NFT. If you own the NFT, you own the spot. Check out the spots for sale at <a href="https://beta.opentheta.io/collection/thetamillion" target="_blank">OpenTheta</a>. After buying the spot you can come back and change the values of your spot.
            </p>
        </div>
        <div className={styles.right}>
            <h2>Every spot is also an NFT!</h2>
            <p>The contract implements the NFT (Non-Fungible Token) standard. That means every bought spot is also an NFT. By buying a spot you are actually creating/minting an NFT. The NFT contains information about where the spot is located in the image and other information. Only the owner of the NFT can change the content of the spot. When you transfer your NFT to someone else, that person gains control over the spot in the grid above.</p>

            <p>If you want to see what the minting process looked like (while there were still spots available), check out <a href="https://imgur.com/wkAQold" target="_blank">this 20 second GIF</a>.</p>

            <p>If you want to see what an NFT looks like, check out this <Link href="/nft_#example">NFT example</Link>.</p>

            <p>To see all owners and which spots are for sale, see the <Link href="/list">list of owners</Link>.</p>

            <h2>Theta Hackathon</h2>
            <p>This is my entry for the Theta Q1 2022 Hackathon. See my entry and more information on the <a href="https://devpost.com/software/a-ax42yu" target="_blank">hackathon page</a>.</p>

            <h2>Source Code on Github</h2>
            <ul>
                <li><a href="https://github.com/thetamillion/website" target="_blank">Frontend</a> (TypeScript/React/Next.js)</li>
                <li><a href="https://github.com/thetamillion/nft-server" target="_blank">NFT generation server</a> (TypeScript/Express)</li>
            </ul>

            <h2>Verified Contract</h2>
            <p>
                Check out the verified contract on the explorer: <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">{CONTRACT_ADDRESS.slice(0, 5)}...{CONTRACT_ADDRESS.slice(-4)}</a>
            </p>

            <h2>My image is not showing up. How do I do this?</h2>
            <p>Make sure you are actually using an image and not a website that contains an image. An example that <strong>won't work</strong> is this: <a href="https://imgur.com/Zbjhl65" target="_blank">https://imgur.com/Zbjhl65</a> This is a website and not an image, you <strong>don't</strong> want to use that as image URL! To get the correct image URL you need to right-click on the image and press "Copy image address". This will return this: <a href="https://i.imgur.com/Zbjhl65.png" target="_blank">https://i.imgur.com/Zbjhl65.png</a> which is the actual image URL which you can use.</p>
        </div>
    </div>
}