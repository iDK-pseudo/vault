import React, { Component } from 'react';
import '../styles/Form.css'

class Form extends Component{

    constructor(props) {
        super(props);
        this.state = {
            bank: {value: '', showError: false, errorMsg: ''},
            cardnum: {value: '', showError: false, errorMsg: ''},
            expires: {value: '', showError: false, errorMsg: ''},
            cvv: {value: '', showError: false, errorMsg: ''}
        }
    }

    handleChange = (e) => {
        switch(e.target.name) {
            case 'bank': this.setState({bank: {value: e.target.value, showError: false}}); break;
            case 'cardnum': this.setState({cardnum: {value: e.target.value, showError: false}}); break;
            case 'expires': this.setState({expires: {value: e.target.value, showError: false}}); break;
            case 'cvv': this.setState({cvv: {value: e.target.value, showError: false}}); break;
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const payload = this.generatePayload(this.state);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
        const response = await fetch('/api', requestOptions);
        const data = await response.json();
        this.setState(data);
    }

    generatePayload = (state) => {
        let payload = {}
        for(const [key, value] of Object.entries(state)){
            payload[key] = value.value;
        }
        return payload;
    }

    render () {
        return (
            <form class="card-details-form" onSubmit={this.handleSubmit}>
                <label> Bank </label>
                <input className={this.state.bank.showError ? 'error' : ''} name="bank" type="text" value={this.state.bank.value} onChange={this.handleChange}/>
                <p className="error-msg">{this.state.bank.errorMsg}</p> 
                <label> Card Number </label>
                <input className={this.state.cardnum.showError ? 'error' : ''} name="cardnum" type="number" value={this.state.cardnum.value} onChange={this.handleChange}/>
                <p className="error-msg">{this.state.cardnum.errorMsg}</p> 
                <label> Expires </label>
                <input className={this.state.expires.showError ? 'error' : ''} name="expires" type="month" onChange={this.handleChange}/>
                <p className="error-msg">{this.state.expires.errorMsg}</p> 
                <label> CVV </label>
                <input className={this.state.cvv.showError ? 'error' : ''} name="cvv" type="text" value={this.state.cvv.value} onChange={this.handleChange}/>
                <p className="error-msg">{this.state.cvv.errorMsg}</p> 
                <button type="submit"> + </button>
            </form>
        )
    }
}

export default Form;