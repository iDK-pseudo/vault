import '../styles/Table.css'
import { useState, useEffect } from 'react';

function Table (props) {

    const [entries, setEntries] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api');
            const data = await response.json();
            const modifiedEntries = data.map((eachEntry)=>{
                return ( 
                    <tr key={eachEntry._id} className='data-row'>
                        <td> {eachEntry.bank} </td>
                        <td> {eachEntry.cardnum.slice(-4)} </td>
                        <td> {eachEntry.expires} </td>
                    </tr>
                )
            })
            setEntries(modifiedEntries);
            setDataFetched(true);
        };
        fetchData();
    }, []);

    if(!dataFetched){
        return (
            <table className="table">
                <thead>
                    <tr className="header-row">
                        <th>Bank</th>
                        <th>Last 4 Digits</th>
                        <th>Expires</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="data-row">
                        <td colSpan={3}>
                            Loading...
                        </td>
                    </tr>
                </tbody>
            </table>
        ) 
    }

    return(
        <table className="table">
            <thead>
                <tr className="header-row">
                    <th>Bank</th>
                    <th>Last 4 Digits</th>
                    <th>Expires</th>
                </tr>
            </thead>
            <tbody>
                {entries}
                <tr className="data-row">    
                    <td className="add-row" colSpan="3" onClick={()=>props.onClickNewItem()}>
                        +
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default Table;