import Head from 'next/head'

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Head>
        <title>Squad Game</title>
        <meta name="description" content="Quiz with player elimination" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {children}
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