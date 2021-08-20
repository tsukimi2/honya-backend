import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import Layout from '../components/layout/layout'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
// import { AuthContextProvider } from '../contexts/AuthContext'
import AuthContextProvider from '../contexts/AuthContext'

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

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
