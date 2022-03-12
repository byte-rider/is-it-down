import '../styles/globals.css'
import Layout from '../components/Layout/Layout'
import { AboutModalProvider } from '../components/About/AboutModalContext'

function MyApp({ Component, pageProps }) {
  return (
    <AboutModalProvider>
      <Layout />
    </AboutModalProvider>
  )
}

export default MyApp
