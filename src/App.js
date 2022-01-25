import './App.css';
import Card from './components/Card.js';
import Header from './components/Header.js';
import Table from './components/Table.js';
import Form from './components/Form.js';
import React, { Component } from 'react';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      displayForm : false,
      selectedCard : 0,
      tableData: []
    }
  }

  showForm = () => {
    this.setState({displayForm: true});
  }

  hideForm = () => {
    this.setState({displayForm: false});
  }

  handleItemClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    this.setState({selectedCard: this.state.tableData.find(e=>e._id===id)});
  }

  componentDidMount = async () => {
    const response = await fetch('/api');
    const data = await response.json();
    this.setState({tableData: data});
  }

  render () {
    const {displayForm, selectedCard, tableData} = this.state;

    if(!displayForm){
      return (
        <div>
          <Header/>
          <Card selectedCard={selectedCard}/>
          <Table tableData = {tableData} onClickNewItem={this.showForm} handleItemClick={this.handleItemClick}/>
        </div>
      );
    }else{
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
