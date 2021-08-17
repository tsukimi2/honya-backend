import Head from 'next/head'
import Layout from '../components/layout/layout'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthContextProvider from '../contexts/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
