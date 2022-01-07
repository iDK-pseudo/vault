import '../styles/Table.css'

function Table (props) {
    console.log(props);
    return(
        <table class="table">
            <tr class="header-row">
                <th>Bank</th>
                <th>Last 4 Digits</th>
                <th>Provider</th>
            </tr>
            <tr class="data-row">
                <td class="add-row" colspan="3" onClick={()=>props.onClickNewItem()}>
                    +
                </td>
            </tr>
        </table>
    );
}

export default Table;