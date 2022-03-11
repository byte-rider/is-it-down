import styles from './Results.module.css'
import CrossSVG from '../SVGs/CrossSVG';
import TickSVG from '../SVGs/TickSVG';
import { useContext } from 'react';
import { ResultsContext } from './ResultsContext';

const Results = () => {
    const resultsContext = useContext(ResultsContext);
    return (
        resultsContext.address.length == 0 ?
        null :
        <div className={styles.container}>
            <p>{resultsContext.address}</p>
            <ResultsList resultsArray={resultsContext.resultsArray}/>
        </div>
    )
}

const ResultsList = ({ resultsArray }) => {
    return (
        resultsArray.map(result => {
            return <ResultEntry result={result} key={resultsArray.indexOf(result)} />
        })
    );
}

const ResultEntry = ({result}) => {
    console.log(result);
    let status;

    result.hostIsUp ? status=styles.hostIsUp : status=styles.hostIsDown

    return (
        <ul className={status}>
            <li>
                {result.hostIsUp ? <TickSVG /> : <CrossSVG />}
            </li>
            <li className={styles.protocol}>{result.protocol}</li>
            <li className={styles.message}>...</li>
        </ul>
    );
}

export default Results