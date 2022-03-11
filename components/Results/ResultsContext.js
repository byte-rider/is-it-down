import { useState, createContext } from "react";

const ResultsContext = createContext();

const ResultsProvider = (props) => {
    const [resultsArray, setResultsArray] = useState([]);
    const [address, setAddress] = useState("");

    const _addToResults = (newArray) => {
        setResultsArray(() => newArray)
    }

    const _clearResults = () => {
        setResultsArray(() => [])
    }

    const value = {
        resultsArray: resultsArray,
        _addToResults: _addToResults,
        _clearResults: _clearResults,
        address: address,
        setAddress: setAddress
    }

    return (
        <ResultsContext.Provider value={value}>
            {props.children}
        </ResultsContext.Provider>
    );
}

export {ResultsContext, ResultsProvider}