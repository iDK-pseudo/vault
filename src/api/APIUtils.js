class APIUtils {

    static addNewCard = async (cardnum, month, year, cvv) => {  
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({cardnum, month, year, cvv})
        };
        const response = await fetch('/api', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }

    static verifyUser = async () => {
        const response = await fetch('/verify');
        const jsonData = response.json()
        return jsonData.isLoggedIn;
    }

    static getCardList = async () => {
        const response = await fetch('/cards');
        const jsonData = await response.json();
        return jsonData.entries;
    }


    static loginUser = async (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: email, password})
        };
        const response = await fetch('/login', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }
}

export default APIUtils;