import '../styles/Table.css'
import { useState, useEffect } from 'react';

function Table (props) {

    const [entries, setEntries] = useState([]);
    const [dataPresent, setDataPresent] = useState(false);

    useEffect(() => {
        if(props.tableData.length){
            const modifiedEntries = props.tableData.map((eachEntry)=>{
                return ( 
                    <tr key={eachEntry._id} className='data-row' data-id={eachEntry._id} onClick={props.handleItemClick}>
                        <td> {eachEntry.bank} </td>
                        <td> {eachEntry.cardnum.slice(-4)} </td> 
                    </tr>
                )
            })
            setEntries(modifiedEntries);
            setDataPresent(true);
        }
    },[props.tableData]);

    if(!dataPresent){
        return (
            <table className="table">
                <thead>
                    <tr className="header-row">
                        <th>Bank</th>
                        <th>Last 4 Digits</th>
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
                        <th>Last 4 Digits</th>
                    </tr>
                </thead>
                <tbody>
                    {entries}
                </tbody>
            </table>
            <button className="add-button" onClick={()=>props.onClickNewItem()}>+</button>
        </div>
    );
}

export default Table;