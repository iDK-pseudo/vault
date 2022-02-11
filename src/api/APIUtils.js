const handleAddNewCardAPI = async (cardnum, month, year, cvv) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({cardnum, month, year, cvv})
    };
    const response = await fetch('/api', requestOptions);
    const data = await response.json();
    return data;
}


export default handleAddNewCardAPI;