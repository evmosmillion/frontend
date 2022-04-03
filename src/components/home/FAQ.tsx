
import { CONTRACT_ADDRESS } from '../../hooks/contractInteraction';
import styles from './FAQ.module.scss';

export default function FAQ() {
    return <div id='faq' className={styles.faq}>
        <div className={styles.left}>
            <h2>What is this?</h2>
            <p>Remember the <a href="https://en.wikipedia.org/wiki/The_Million_Dollar_Homepage" target="_blank">The Million Dollar Homepage</a>? You could buy a pixel for $1 per pixel. This is the same concept but decentralized on the Theta blockchain.</p>
            <p>All data is stored and loaded from the <a href="https://www.thetatoken.org/" target="_blank">Theta Blockchain</a>. This decentralized application (dApp) does not have a traditional server that stores the data.</p>

            <h2>How does this work?</h2>
            <p>The smart contract <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">{CONTRACT_ADDRESS}</a> is responsible for storing and validating the data. When you buy a spot, the contract will check if the space is not already used by someone else and if you paid the correct amount of TFUEL. TFUEL is the currency for payment on the Theta Blockchain. After paying the contract your data is stored forever on the blockchain. If you want to update the data you only have to pay for the costs of the transaction (called gas). That means only you are able to control your spot, but in case you add vulgar or NSFW content, I implemented a "NSFW" flag, that only I (the owner of the contract) can set. When used, the image of the spot will be hidden by default. So please, don't store this kind of data...</p>
            
            <h2>What happens when all spots are gone?</h2>
            <p>The space is limited. You can only buy spots in multiples of 20x20 pixels. That means in total there are only 2,500 (50x50) spots available at maximum. After all spots are gone, the contract will not allow any new spots. But each spot is awarded in form of an NFT. That means you can transfer your spot, or even sell it to others.</p>
        </div>
        <div className={styles.right}>
            <h2>Every spot is also an NFT!</h2>
            <p>The contract implements the NFT (Non-Fungible Token) Standard. That means every bough spot is also an NFT. The NFT contains information about where the spot is located in the image and about width and height. Only the owner of the NFT can change the content of the spot. That means by transferring your NFT to someone else, that person gains control over the spot in the billboard above. That means you can also sell or buy a spot.</p>

            <h2>See it in action!</h2>
            <p>Here is a GIF that shows the buy and update process: TODO.</p>

            <h2>Source Code</h2>
            <p>The contract is verified on the <a href={`https://explorer.thetatoken.org/account/${CONTRACT_ADDRESS}`} target="_blank">blockchain explorer</a>. You can find the whole source code of this website on <a href="TODO">github</a>.</p>
        </div>
    </div>
}