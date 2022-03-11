import { filterProps } from "framer-motion";
import {useState, useEffect, createContext} from "react";

const HistoryContext = createContext();

const HistoryProvider = (props) => {
    const [historyArray, setHistoryArray] = useState([]);
    const LOCAL_STORAGE_KEY = 'isitdown.history';
    
    const _addToHistory = (entry) => {
        setHistoryArray( currentHistoryArray => {
            const newArray = currentHistoryArray.filter(item => item != entry);
            return [entry, ...newArray];
        });
    }
    
    const _removeEntry = (entry) => {
        setHistoryArray(() => {
            return historyArray.filter(item => item != entry);
        })
    }
    
    const _clearHistory = () => {
        setHistoryArray(() => []);
    }

    // load from disk on first render
    useEffect( () => {
        const historyOnDisk = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (historyOnDisk) {
            setHistoryArray(JSON.parse(historyOnDisk));
        }
    }, []);

    // save to disk on change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historyArray))
    }, [historyArray]);

    const value = {
        historyArray: historyArray,
        _addToHistory: _addToHistory,
        _removeEntry: _removeEntry,
        _clearHistory: _clearHistory,
        setHistoryArray: setHistoryArray
    }

    return (
        <HistoryContext.Provider value={value}>
            {props.children}
        </HistoryContext.Provider>
    );
}

export {HistoryContext, HistoryProvider}