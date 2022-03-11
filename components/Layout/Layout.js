import Nav from '../Nav/Nav';
import History from '../History/History';
import SearchBar from '../SearchBar/SearchBar';
import Results from '../Results/Results';
import styles from './Layout.module.css'
import React, { useState, useEffect } from "react";

import { HistoryProvider } from '../History/HistoryContext';
import { ResultsProvider } from '../Results/ResultsContext';

const Layout = () => {

    return (
        <>
        <HistoryProvider>
            <ResultsProvider>
            <div className={styles.grid}>
                <nav className={styles.nav}><Nav /></nav>
                <section className={styles.searchbar}><SearchBar /></section>
                <section className={styles.result}><Results /></section>
                <aside className={styles.history}><History /></aside>
            </div>
            </ResultsProvider>
        </HistoryProvider>
        </>
    )
}

export default Layout 