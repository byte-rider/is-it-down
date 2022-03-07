
const History = ( { historyArray, _removeEntry, _clearHistory } ) => {
    return (
        <div className="outline history">
            <HistoryList historyArray={historyArray} _removeEntry={_removeEntry} />
            <button onClick={_clearHistory}>clear history</button>
        </div>
    )
}

// component
function HistoryList({ historyArray, _removeEntry }) {
    return (
        historyArray.map(site => {
            return <HistoryEntry site={site} _removeEntry={_removeEntry} />
        })
    );
}

// component
function HistoryEntry({site, _removeEntry}) {
    return (
        <div>
            {site} <button onClick={() => _removeEntry(site)}>X</button>
        </div>
    );
}


export default History;