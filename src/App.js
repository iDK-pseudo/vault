import './App.css';
import Welcome from './components/Welcome.js';
import Card from './components/Card.js';
import Header from './components/Header.js';
import Table from './components/Table.js';
import Form from './components/Form.js';
import React, { Component } from 'react';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      display : 'rendering',
      selectedCard : 0,
      tableData: []
    }
  }

  showForm = () => {
    this.setState({display: 'form'});
  }

  hideForm = () => {
    this.setState({display: 'homepage'});
  }

  handleLoginSuccess = async () => {
    const response = await fetch('/cards');
    const data = await response.json();
    this.setState({display:'homepage',tableData: data.entries, selectedCard: data.entries[0]});
  }

  handleItemClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    this.setState({selectedCard: this.state.tableData.find(e=>e._id===id)});
  }

  componentDidMount = async () => {
    let response = await fetch('/verify');
    let data = await response.json();
    if(!data.isLoggedIn){
      this.setState({display:'welcome'});
    }else{
      response = await fetch('/cards');
      data = await response.json();
      this.setState({display:'homepage',tableData: data.entries, selectedCard: data.entries[0]});
    }
  }

  render () {
    const {display, selectedCard, tableData} = this.state;
    switch(display){
      case 'rendering':
        return (
          <div>
            <Header/>
            <div class="loader"></div>
          </div>
        )
      case 'welcome':
        return (
          <div>
            <Header/>
            <Welcome handleLoginSuccess={this.handleLoginSuccess}/>
          </div>
        )
      case 'homepage': 
        return (
          <div>
            <Header/>
            <Card selectedCard={selectedCard}/>
            <Table selectedCard={selectedCard} tableData = {tableData} onClickNewItem={this.showForm} handleItemClick={this.handleItemClick}/>
          </div>
        );
      case 'form':
        return (
          <div>
            <Header/>
            <Form onNewEntrySuccess={this.hideForm} handleBackClick={this.hideForm}/>
          </div>
        )
    }
  }
}

export default App;
