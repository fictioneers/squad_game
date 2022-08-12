import '../styles/globals.css';
import Layout from '../components/Layout';
import GameProvider from '../components/GameContext';

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GameProvider>
  );
}

export default MyApp;
