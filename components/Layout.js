import Head from 'next/head'
import { useState } from 'react'
import BossStatus from './BossStatus';

const Layout = ({ children }) => {
  const [bossView, setBossView] = useState(false);

  const toggleBoss = () => {
    setBossView(!bossView);
  }

  return (
    <div className="container">
      <Head>
        <title>Squad Game</title>
        <meta name="description" content="Quiz with player elimination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button
        onClick={toggleBoss}
        className="boss-button">
        {!bossView && "Check on the Boss"}
        {bossView && "Hide from the Boss"}
      </button>

      <main>
        {!bossView && children}
        {bossView && (
          <BossStatus />
        )}
      </main>

      <footer>
        <a
          href="https://fictioneers.co.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Fictioneers
        </a>
      </footer>
    </div>
  )
}

export default Layout