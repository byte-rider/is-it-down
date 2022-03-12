import styles from './Results.module.css'
import CrossSVG from '../SVGs/CrossSVG';
import TickSVG from '../SVGs/TickSVG';
import { useContext } from 'react';
import { ResultsContext } from './ResultsContext';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
    const resultsContext = useContext(ResultsContext);
    return (
        resultsContext.address.length == 0 ? null :
        <div className={styles.container} initial={{opacity: 0}} animate={{opacity: 1}}>
            <p>{resultsContext.address}</p>
            <ResultsList resultsArray={resultsContext.resultsArray}/>
        </div>
    )
}

const ResultsList = ({resultsArray}) => {
    return (
        <AnimatePresence initial={false}>
            {resultsArray.map( (result, i) => <ResultEntry result={result} key={i.toString()} /> )}
        </AnimatePresence>
    );
}

const ResultEntry = ({result}) => {
    const resultsContext = useContext(ResultsContext);
    const status = result.hostIsUp ? styles.hostIsUp : styles.hostIsDown
    let animation = {
        initial: {},
        animate: {},
        exit: {},
    }

    if (result.hostIsUp) {
        animation.initial = {width: "9rem"}
        animation.animate = {width: "100%", transition: {duration: 0.7}}
    }

    if (!result.hostIsUp) {
        animation.initial = {}
        animation.animate = {
            x: [0, +3, -3], 
            transition: {
                type: "tween",
                duration: 0.1,
                repeat: 3,
                repeatType: 'reverse',
            }
        }
    }
    return (
        <motion.ul key={result.protocol} onClick={() => resultsContext._toggleMoreInfo(result)} className={status} {...animation} >
            <li>
                {result.hostIsUp ? <TickSVG /> : <CrossSVG />}
            </li>
            <li className={styles.protocol}>{result.protocol}</li>
            {result.extraInfoRevealed && <ExtraInformation result={result} />}
        </motion.ul>
    );
}

const ExtraInformation = ({result}) => {
    const extraInfoArray = Object.entries(result.extraInfo);
    return (
        <table className={styles.extraInfoTable}>
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {extraInfoArray.map((current, i) => 
                    <ExtraInformationProperty key={i.toString()} name={current[0]} value={current[1]} i={i} />
                )}
            </tbody>
        </table>
    );
}

const ExtraInformationProperty = ({name, value, i}) => {
    const staggerDelay = 0.05
    const duration = 0.4
    const animationLeftText = {
        initial: {translateX: -50, opacity: 0},
        animate: {translateX: 0, opacity: 1, 
            transition: {
                delay: i * staggerDelay,
                duration: duration,
            },
        },
        exit: {},
    }

    const animationRightText = {
        initial: {translateX: 500, opacity: 0},
        animate: {translateX: 0, opacity: 1,
            transition: {
                delay: i * staggerDelay,
                duration: duration,
            }
        },
        exit: {},
    }
    return (
        <tr key={name}>
            <motion.th scope="row" {...animationLeftText}>{name}:</motion.th>
            <motion.td {...animationRightText}>{value}</motion.td>
        </tr>
    )
}

export default Results