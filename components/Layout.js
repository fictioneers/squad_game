import Head from 'next/head'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Who's That Pokemon?</title>
        <meta name="description" content="Pokemon identification quiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
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