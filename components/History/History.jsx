import styles from './History.module.css';
import ClockSVG from '../SVGs/ClockSVG';
import RubbishBinSVG from '../SVGs/RubbishBin';
import DeleteSVG from '../SVGs/DeleteSVG';
import { useContext } from 'react';
import { HistoryContext } from './HistoryContext';
import { SearchBarContext } from '../SearchBar/SearchBarContext';
import { motion, AnimatePresence } from 'framer-motion';

const slideInAnimation = {
    initial: {opacity: 0, x: 140},
    animate: {opacity: 1, x: 0},
    exit: {opacity: 0, x: 140}
}
const spring = {
    type: "spring",
    stiffness: 200,
    damping: 30
};

const History = () => {
    const state = useContext(HistoryContext);
    
    return (
        <AnimatePresence initial={false} exitBeforeEnter={true}>
            {state.historyArray.length == 0 ? null :
            <motion.div className={styles.container} key="history-container" {...slideInAnimation} transition={spring}>
                <p onClick={() => temp()}>history</p>
                <HistoryList />
                <ul>
                    <li>clear</li>
                    <li><span onClick={() => state._clearHistory()}>
                            <RubbishBinSVG />
                        </span>
                    </li>
                </ul>
            </motion.div>}
        </AnimatePresence>
    )
}


const HistoryList = () => {
    const state = useContext(HistoryContext);
    return (
        <AnimatePresence initial={false}>
            {state.historyArray.map(site => <HistoryEntry site={site} key={site} />)}
        </AnimatePresence>
    )
}

const HistoryEntry = ({site}) => {
    const state = useContext(HistoryContext);
    const searchBarContext = useContext(SearchBarContext);
    const deleteAnimation = {
        initial: { x: 50 },
        animate: { x: 0, scale: 1 },
        exit: { scale: 0 }
    }

    const entryClicked = (e, prop) => {
        e.preventDefault();
        
        // add domain from history to search bar if different
        const el = searchBarContext.inputHostReference.current;
        if (el.value === prop) {
            el.focus();
            return;
        }

        el.value = prop;
        
        // animate search bar
        el.className = "animateHeartbeat";
        setTimeout(() => el.className = "", 800)
        el.focus();

        // put to top of history list
        state._addToHistory(prop);
    }

    return (
        <motion.ul key={site} {...deleteAnimation} layout>
            <li onMouseDown={(e) => entryClicked(e, site)} className={styles.domainName}>{site}</li>
            <li><span onClick={() => state._removeEntry(site)}><DeleteSVG /></span></li>
        </motion.ul>
    )
}

export default History;