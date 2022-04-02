import type { AppProps } from 'next/app';
import '../components/layouts/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
