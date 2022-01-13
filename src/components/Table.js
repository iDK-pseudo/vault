import '../styles/Table.css'
import { useState, useEffect } from 'react';

function Table (props) {

    const [entries, setEntries] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
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
        };
        fetchData();
    });

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