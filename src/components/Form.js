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
            case 'cardnum': 
                let finalVal = e.target.value;
                if(e.target.value.length>19) return;
                if(e.target.value.length<19 && e.target.value.replaceAll('-','').length%4 === 0)
                    if(e.nativeEvent.inputType.includes('insert'))
                        finalVal+='-';
                    else if(e.nativeEvent.inputType.includes('delete'))
                        finalVal = finalVal.substring(0,finalVal.length-1);
                this.setState({cardnum: {value: finalVal, showError: false}}); break;
            case 'expires': this.setState({expires: {value: e.target.value, showError: false}}); break;
            case 'cvv': 
                if(e.target.value.length === 4) return;
                this.setState({cvv: {value: e.target.value, showError: false}}); break;
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
        if(data.success){
            this.props.onNewEntrySuccess();
        }else{
            this.setState(data);
        }
    }

    generatePayload = (state) => {
        let payload = {}
        for(const [key, value] of Object.entries(state)){
            if(key === 'cardnum')
                payload[key] = value.value.replaceAll('-','');
            else
                payload[key] = value.value;
        }
        return payload;
    }

    render () {
        return (
            <div>
                <form className="card-details-form">
                    <label> Bank </label>
                    <input className={this.state.bank.showError ? 'error' : ''} name="bank" type="text" value={this.state.bank.value} onChange={this.handleChange}/>
                    <p className="error-msg">{this.state.bank.errorMsg}</p> 
                    <label> Card Number </label>
                    <input className={this.state.cardnum.showError ? 'error' : ''} pattern = '[0-9\-]+' name="cardnum" type="tel" value={this.state.cardnum.value} onChange={this.handleChange}/>
                    <p className="error-msg">{this.state.cardnum.errorMsg}</p> 
                    <label> Expires </label>
                    <input className={this.state.expires.showError ? 'error' : ''} name="expires" type="month" onChange={this.handleChange}/>
                    <p className="error-msg">{this.state.expires.errorMsg}</p> 
                    <label> CVV </label>
                    <input className={this.state.cvv.showError ? 'error' : ''} name="cvv" type="text" value={this.state.cvv.value} onChange={this.handleChange}/>
                    <p className="error-msg">{this.state.cvv.errorMsg}</p>      
                </form>
                <button className='btn submit' type="submit" onClick={this.handleSubmit}> Add </button>
                <button className='btn back' onClick={this.props.handleBackClick}>Cancel</button>
            </div>
        )
    }
}

export default Form;