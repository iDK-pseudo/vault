import '../styles/Table.css'
import { useState, useEffect } from 'react';

function Table (props) {

    const [entries, setEntries] = useState([]);
    const [dataPresent, setDataPresent] = useState(false);

    useEffect(() => {
        if(props.tableData.length){
            const id = props.selectedCard._id || props.tableData[0]._id;
            const modifiedEntries = props.tableData.map((eachEntry)=>{
                return ( 
                    <tr key={eachEntry._id} className={eachEntry._id === id ? 'data-row selected' : 'data-row' } data-id={eachEntry._id} onClick={props.handleItemClick}>
                        <td> {eachEntry.bank} </td>
                        <td> {eachEntry.cardnum.slice(-4)} </td> 
                    </tr>
                )
            })
            setEntries(modifiedEntries);
            setDataPresent(true);
        }
    },[props.tableData, props.selectedCard]);

    if(!dataPresent){
        return (
            <table className="table">
                <thead>
                    <tr>
                        <td>Loading...</td>
                    </tr>
                </thead>
            </table> 
        ) 
    }
    return(
        <div>
            <table className="table">
                <thead>
                    <tr className="header-row">
                        <th>Bank</th>
                        <th>Last 4</th>
                    </tr>
                </thead>
                <tbody>
                    {entries}
                </tbody>
            </table>
            <button className="add-button" onClick={()=>props.onClickNewItem()}>Add</button>
        </div>
    );
}

export default Table;