import '../styles/globals.css';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout fullBleed={Component.fullBleed}>
      <Component {...pageProps} />
    </Layout>
  );
}
