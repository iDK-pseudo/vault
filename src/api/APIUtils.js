class APIUtils {

    static addNewCard = async (cardnum, month, year, cvv) => {  
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({cardnum, month, year, cvv})
        };
        const response = await fetch('/create_card', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }

    static verifyUser = async () => {
        const response = await fetch('/verify');
        const jsonData = await response.json()
        return jsonData.isLoggedIn;
    }

    static getCardList = async () => {
        const response = await fetch('/cardlist');
        const jsonData = await response.json();
        return jsonData.entries;
    }

    static getLastCard = async () => {
        const response = await fetch('/last_card');
        const jsonData = await response.json();
        return jsonData.entry;
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

    static loginLockedUser = async (email, password, pin) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: email, password, pin})
        };
        const response = await fetch('/locked_login', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }

    static signUpUser = async (email, password, pin) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password, pin})
        };
        const response = await fetch('/signup', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }

    static logoutUser = async () => {
        const requestOptions = {
            method: 'POST'
        };
        const response = await fetch('/logout', requestOptions);
        const jsonData = await response.json();
        return jsonData.loggedOut;
    }

    static verifyUserPin = async (pin) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({pin})
        };
        const response = await fetch('/verify_pin', requestOptions);
        const jsonData = await response.json();
        return jsonData.success;
    }

    static lockUser = async () => {
        const response = await fetch('/lock_user');
        const jsonData = await response.json()
        return jsonData.success;
    }

    static resendEmail = async(email) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
        };
        const response = await fetch('/resend_email', requestOptions);
        const jsonData = await response.json();
        return jsonData;
    }

}

export default APIUtils;