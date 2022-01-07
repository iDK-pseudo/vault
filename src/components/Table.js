import '../styles/Table.css'

function Table () {
    return(
        <table class="table">
            <tr class="header-row">
                <th>Bank</th>
                <th>Last 4 Digits</th>
                <th>Provider</th>
            </tr>
            <tr class="data-row">
                <td>HDFC Bank</td>
                <td>5756</td>
                <td>VISA</td>
            </tr>
            <tr class="data-row">
                <td>SBI</td>
                <td>1234</td>
                <td>Rupay</td>
            </tr>
        </table>
    );
}

export default Table;