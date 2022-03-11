import styles from './SearchBar.module.css'
import React, {useRef, useContext} from 'react'
import {apiserver} from '../../config/ApiServerAddress';
import { HistoryContext } from '../History/HistoryContext';
import { ResultsContext } from '../Results/ResultsContext';

const SearchBar = ({_changeAddress}) => {
    const inputHostReference = useRef();
    const inputProtocolReference = useRef();
    const historyContext = useContext(HistoryContext);
    const resultsContext = useContext(ResultsContext);
    
    const _inputHandler = (e) => {
        if (e._reactName === "onKeyUp" && e.keyCode != 13) // on any key except [enter]
            return;
        
        resultsContext._clearResults(); // clear previous output
        const inputProtocol = inputProtocolReference.current.value; 
        let inputHost = inputHostReference.current.value.toString().trim();
        inputHost = inputHost.replace(/https?:\/\//, ""); // strip input of any protocol
        inputHostReference.current.value = ""; // empty input field as courtesy

        // update state
        historyContext._addToHistory(inputHost);
        resultsContext.setAddress(() => inputHost);
        
        // Perform the lookup by calling the api
        fetch(`${apiserver}/api/check`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: inputHost,
                protocol: inputProtocol
            })
        })
        .then(apiResponse => apiResponse.json())
        .then(apiPayloadArray => resultsContext._addToResults(apiPayloadArray))
    }

    return (
        <div className={styles.container}>
            <select ref={inputProtocolReference} name="protocol" id="protocol-select" defaultValue="https">
                <option value="ALL">ALL</option>
                <option value="http">http://</option>
                <option value="https">https://</option>
                <option value="ping">ping</option>
                <option value="vnc">vnc</option>
            </select>
            <input ref={inputHostReference} type="text" placeholder="example.csiro.au" onKeyUp={_inputHandler}/>
            {/* <button className={styles.button} onClick={_inputHandler}>check</button> */}
        </div>
    )
}

export default SearchBar