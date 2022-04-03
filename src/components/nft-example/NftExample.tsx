
import Link from 'next/link';
import styles from './NftExample.module.scss';

const SVG = `<svg width="1000" height="1140" viewBox="0 0 1000 1140" xmlns="http://www.w3.org/2000/svg" style="background:#005f73;">
<style>text {font:bold 45px sans-serif;fill:#fff;} .small {font: bold 30px sans-serif;fill:#fff;}</style>
<text x="20" y="60">ThetaBillboard.com</text>
<text x="980" y="60" text-anchor="end">#137</text>
<svg x="10" y="90" width="980" height="980" viewBox="0.5 0.5 1000 1000">
<defs>
<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94d2bd" stroke-width="2"/>
</pattern>
</defs>
<rect width="1000" height="1000" fill="#005f73" />
<rect width="1000" height="1000" fill="url(#grid)" />
<rect x="240" y="180" width="240" height="80" fill="#ee9b00" />
</svg>
<text x="20" y="1115" class="small">Size 240x80</text>
<text x="980" y="1115" class="small" text-anchor="end">Position (240,180)</text>
</svg>`;

const metadata = {"image":"http://localhost:4005/spot-137-12-9-12-4.svg","external_url":"http://localhost:4005/","description":"Get your spot on ThetaBillboard.com! The owner of this NFT controls the 240x80 wide spot at (240,180) on ThetaBillboard.com. If you own this NFT you can change the title, image and URL for that spot.","name":"ThetaBillboard.com #137: 240x80 at (240,180)","attributes":[{"trait_type":"x","value":240},{"trait_type":"y","value":180},{"trait_type":"width","value":240},{"trait_type":"height","value":80},{"trait_type":"size","value":19200},{"trait_type":"edition","value":137}]};

export default function NftExample() {

    const data = Buffer.from(SVG, 'utf-8');
    return (
        <div className={styles.container}>
            <h1>ThetaBillboard.com NFT</h1>
            <p>Below you see an example image and description of what an NFT might look like.</p>
            <p><Link href="/">Take me back</Link></p>

            <div className={styles.preview}>
                <div className={styles.image}>
                    <img src={`data:image/svg+xml;base64,${data.toString('base64')}`} />
                </div>
                <div className={styles.text}>
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
                                            <li>{e.trait_type}: {e.value}</li>
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