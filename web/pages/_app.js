//import Router from 'next/router'
import Head from 'next/head'
import NextNprogress from 'nextjs-progressbar'
import Layout from '../components/layout/layout'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import 'react-toastify/dist/ReactToastify.css'
import AuthContextProvider from '../contexts/AuthContext'
import CartContextProvider from '../contexts/CartContextProvider'


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NextNprogress
        color="#D1E7DD"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <AuthContextProvider>
        <CartContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
