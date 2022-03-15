import styles from './SearchBar.module.css'
import React, {useRef, useContext} from 'react'
import {apiserver} from '../../config/ApiServerAddress';
import { HistoryContext } from '../History/HistoryContext';
import { ResultsContext } from '../Results/ResultsContext';
import { SearchBarContext } from './SearchBarContext';

const SearchBar = () => {
    const historyContext = useContext(HistoryContext);
    const resultsContext = useContext(ResultsContext);
    const searchBarContext = useContext(SearchBarContext);
    
    const _inputHandler = (e) => {
        if (e._reactName === "onKeyUp" && e.keyCode != 13) { // on any key except [enter]
            return;
        }
        
        if (searchBarContext.inputHostReference.current.value.toString().trim() === "") {
            return
        }
        
        let inputHost = searchBarContext.inputHostReference.current.value.toString().trim();
        const inputProtocol = searchBarContext.inputProtocolReference.current.value; 
        resultsContext._clearResults(); // clear previous output
        inputHost = inputHost.replace(/https?:\/\//, ""); // strip input of any protocol
        inputHost = inputHost.replace(/[^A-Za-z0-9\.:%]/g, ""); // sanitise
        searchBarContext.inputHostReference.current.value = ""; // empty input field as courtesy
        searchBarContext.inputHostReference.current.blur();

        // update state
        historyContext._addToHistory(inputHost);
        resultsContext.setAddress(() => inputHost);

        const callAPI = (protocol) => {
            fetch(`${apiserver}/api/check`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: inputHost,
                        protocol: protocol
                    })
                }
            )
            .then(apiResponse => apiResponse.json())
            .then(apiPayloadArray => resultsContext._addToResults(apiPayloadArray))
        }

        switch (inputProtocol) {
            case 'http':
                callAPI('http');
                break;

            case 'https':
                callAPI('https');
                break;
            
            case 'ping':
                callAPI('ping');
                break;
            
            case 'vnc':
                callAPI('vnc');
                break;
                
            case 'ssh':
                callAPI('ssh');
                break;

            case 'rdp':
                callAPI('rdp');
                break;
            
            case 'ALL':
                callAPI('http');
                callAPI('https');
                callAPI('ping');
                callAPI('ssh');
                callAPI('rdp');
                callAPI('vnc');
                break;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.customSelect}>
                <select ref={searchBarContext.inputProtocolReference} name="protocol" id="protocol-select" defaultValue="https" onChange={() => searchBarContext.inputHostReference.current.focus()}>
                    <option value="ALL">ALL</option>
                    <option value="http">http://</option>
                    <option value="https">https://</option>
                    <option value="ping">ping</option>
                    <option value="vnc">vnc</option>
                    <option value="ssh">ssh</option>
                    <option value="rdp">rdp</option>
                </select>
                <span></span>
            </div>
            <input ref={searchBarContext.inputHostReference} type="text" placeholder="example.csiro.au" onKeyUp={_inputHandler}/>
            {/* <button className={styles.button} onClick={_inputHandler}>check</button> */}
        </div>
    )
}

export default SearchBar