import { useState, createContext } from "react";

const ResultsContext = createContext();

const ResultsProvider = (props) => {
    const [resultsArray, setResultsArray] = useState([]);
    const [address, setAddress] = useState("");

    const _addToResults = (newResult) => {
        newResult[0].extraInfoRevealed = false;
        setResultsArray((current) => [...current, ...newResult])
    }

    const _clearResults = () => {
        setResultsArray(() => [])
    }

    const _toggleMoreInfo = (resultToToggle) => {
        const newArray = [...resultsArray];
        const index = newArray.indexOf(resultToToggle);
        newArray[index].extraInfoRevealed = !newArray[index].extraInfoRevealed;
        setResultsArray(newArray)
    }

    const value = {
        resultsArray: resultsArray,
        _addToResults: _addToResults,
        _clearResults: _clearResults,
        _toggleMoreInfo: _toggleMoreInfo,
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