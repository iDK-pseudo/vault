import './App.css';
import Welcome from './components/Welcome.js';
import Card from './components/Card.js';
import Header from './components/Header.js';
import AddCardDrawer from './components/mui_components/AddCardDrawer.js';
import React, { Component } from 'react';
import BottomNav from './components/mui_components/BottomNav.js';
import CardList from './components/mui_components/CardList.js';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      display : 'rendering',
      selectedCard : 0,
      tableData: [], 
      drawerOpen: false
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

  handleLogout = async () => {
    const response = await fetch('/logout',{method: 'POST'});
    const data = await response.json();
    if(data.loggedOut){
        this.setState({display: 'welcome'})
    } 
  }   

  handleItemClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    this.setState({selectedCard: this.state.tableData.find(e=>e._id===id)});
  }

  componentDidMount = async () => {
    let response = await fetch('/verify');
    let data = await response.json();
    if(!data.isLoggedIn){
      this.setState({display:'homepage'});
    }else{
      response = await fetch('/cards');
      data = await response.json();
      this.setState({display:'homepage',tableData: data.entries, selectedCard: data.entries[0]});
    }
  }

  handleAddNewCardSuccess = async () => {

  }

  render () {
    const {display, selectedCard, tableData} = this.state;
    switch(display){
      case 'rendering':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <div className="loader"></div>
          </div>
        )
      case 'welcome':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <Welcome handleLoginSuccess={this.handleLoginSuccess}/>
          </div>
        )
      case 'homepage': 
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <Card selectedCard={selectedCard}/>
            <CardList/>
            <AddCardDrawer 
              open={this.state.drawerOpen} 
              handleDrawerClose={()=>this.setState({drawerOpen: false})}
              handleAddNewCardSuccess={this.handleAddNewCardSuccess}
            />
            <BottomNav 
              handleAddCard={()=>this.setState({drawerOpen: true})}
            />
          </div>
        );
    }
  }
}

export default App;
