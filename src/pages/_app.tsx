import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import '../components/layouts/globals.scss';
import contractInteraction from '../hooks/contractInteraction';

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        contractInteraction.gatherSpots();
    }, []);
    return <>
        <Head>
            <title>EvmosMillion.com</title>
            <meta name="description" content="Buy your pixels on ThetaMillion.com! Only 1 million pixels available." />
            <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2286%22>📋</text></svg>" />
        </Head>
        <Component {...pageProps} />
    </>
}
