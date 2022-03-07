import Nav from './Nav';
import History from './History';
import SearchBar from './SearchBar';
import Result from './Result';
import Footer from './Footer';
import styles from '../styles/Layout.module.css'
import React, { useState, useEffect } from "react";

const Layout = () => {
    const [historyArray, setHistoryState] = useState([]);
    const [resultsArray, setResultsState] = useState([]);
    const LOCAL_STORAGE_KEY = 'isitdown.history';

    // load history
    useEffect(() => {
        const historyOnDisk = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (historyOnDisk)
            setHistoryState(JSON.parse(historyOnDisk));
      }, []); 

    // save history on change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historyArray))
    }, [historyArray]);

    // clear history
    function _clearHistory(e) {
        setHistoryState( () => {return []} );
    };

    // remove history item
    function _removeEntry(entry) {
        setHistoryState(() => {
            return historyArray.filter(item => item != entry);
        })
    }

    // add to history
    function _addToHistory(entry) {
        setHistoryState( (currentHistoryArray) => {
            const newArray = currentHistoryArray.filter(item => item != entry);
            return [entry, ...newArray];
        });
    }

    function _addToResults(newArray) {
        setResultsState( () => {
            return newArray;
        })
    }

    return (
        <div className={styles.grid}>
            <nav className={styles.nav}><Nav /></nav>
            <section className={styles.searchbar}><SearchBar _addToHistory={_addToHistory} _addToResults={_addToResults}/></section>
            <section className={styles.result}><Result resultsArray={resultsArray}/></section>
            <aside className={styles.history}><History historyArray={historyArray} _removeEntry={_removeEntry} _clearHistory={_clearHistory} /></aside>
        </div>
    )
}

export default Layout 