import Head from 'next/head'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Squad Game</title>
        <meta name="description" content="Quiz with player elimination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Squad Game
        </h1>
        {children}
      </main>

      <footer className={styles.footer}>
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