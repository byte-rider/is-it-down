import styles from './History.module.css';
import ClockSVG from '../SVGs/ClockSVG';
import RubbishBinSVG from '../SVGs/RubbishBin';
import DeleteSVG from '../SVGs/DeleteSVG';
import { useContext } from 'react';
import { HistoryContext } from './HistoryContext';

const History = () => {
    const state = useContext(HistoryContext);
    return (
        state.historyArray.length == 0 ? null :
        <div className={styles.container}>
            <p>history</p>
            <HistoryList />
            <ul>
                <li>clear</li>
                <li><span onClick={() => state._clearHistory()}>
                        <RubbishBinSVG />
                    </span>
                </li>
            </ul>
        </div>
    )
}

const HistoryList = () => {
    const state = useContext(HistoryContext);

    return (
        state.historyArray.map(site => {
            return (
                <ul key={site.toString()}>
                    <li className={styles.domainName}>{site}</li>
                    <li><span onClick={() => state._removeEntry(site)}><DeleteSVG /></span></li>
                </ul>
            )
        })
    );
}

export default History;