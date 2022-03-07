
const Result = ({resultsArray}) => {
    return (
        <div className="result">
            <ResultsList resultsArray={resultsArray}/>
        </div>
    )
}

// component
function ResultsList({ resultsArray }) {
    return (
        resultsArray.map(result => {
            return <ResultEntry result={result} />
        })
    );
}

// component
function ResultEntry({result}) {
    console.log("result");
    console.log(result);
    // const {httpStatusCode, resultEmoji, serverStatusCode, serverStatusMessage} = result;
    return (
        <div className="outline">
            {JSON.stringify(result)}
            {/* {httpStatusCode}
            {resultEmoji}
            {serverStatusCode}
            {serverStatusMessage} */}
        </div>
    );
}

export default Result