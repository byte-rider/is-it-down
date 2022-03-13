import '../styles/globals.css'
import Layout from '../components/Layout/Layout'
import { AboutModalProvider } from '../components/About/AboutModalContext'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>is it down?</title>
      </Head>
      <AboutModalProvider>
        <Layout />
      </AboutModalProvider>
    </>
  )
}

export default MyApp
