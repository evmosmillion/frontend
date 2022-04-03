import Head from 'next/head';
import Home from '../components/home/Home';

export default function index() {
    return (
        <>
            <Head>
                <title>Theta Billboard</title>
                <meta name="description" content="TODO" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Home />
        </>
    )
}