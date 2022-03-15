import styles from './Layout.module.css'
import Nav from '../Nav/Nav';
import History from '../History/History';
import SearchBar from '../SearchBar/SearchBar';
import Results from '../Results/Results';
import AboutModal from '../About/AboutModal';

import { HistoryProvider } from '../History/HistoryContext';
import { ResultsProvider } from '../Results/ResultsContext';
import { SearchBarProvider } from '../SearchBar/SearchBarContext';

import { AboutModalContext } from '../About/AboutModalContext';
import { useContext } from 'react';

const Layout = () => {
    const aboutModalContext = useContext(AboutModalContext);
    return (
        <HistoryProvider>
            <ResultsProvider>
                <SearchBarProvider>
                    <div className={styles.grid}>
                        {aboutModalContext.modalIsOpen && <AboutModal />}
                        <nav className={styles.nav}><Nav /></nav>
                        <section className={styles.searchbar}><SearchBar /></section>
                        <section className={styles.result}><Results /></section>
                        <aside className={styles.history}><History /></aside>
                    </div>
                </SearchBarProvider>
            </ResultsProvider>
        </HistoryProvider>
    )
}

export default Layout 