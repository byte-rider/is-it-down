import styles from '../styles/SearchBar.module.css'
import React, {useRef} from 'react'
import {apiserver} from '../config';


const SearchBar = ({_addToHistory, _addToResults}) => {
    const inputHostReference = useRef();
    const inputProtocolReference = useRef();
    
    function _inputHandler(e) {
        if (e._reactName === "onKeyUp" && e.keyCode != 13) // on any key except [enter]
            return;
        
        // grab input and perform pre-processing
        const inputProtocol = inputProtocolReference.current.value;
        let inputHost = inputHostReference.current.value.toString().trim();
        inputHost = inputHost.replace(/https?:\/\//, "");

        _addToHistory(inputHost);
        
        // call the api
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
        .then(apiPayloadArray => _addToResults(apiPayloadArray))
        
        inputHostReference.current.value = "";
    }

    return (
        <div className={styles.container}>
            <select ref={inputProtocolReference} name="protocol" id="protocol-select">
                <option value="ALL">ALL</option>
                <option value="http">http://</option>
                <option value="https">https://</option>
                <option value="ping">ping</option>
                <option value="vnc">vnc</option>
            </select>
            <input ref={inputHostReference} type="text" onKeyUp={_inputHandler}/>
            <button onClick={_inputHandler}>check</button>
        </div>
    )
}

export default SearchBar