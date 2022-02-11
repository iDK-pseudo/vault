import './App.css';
import Welcome from './components/Welcome.js';
import CreditCard from './components/mui_components/CreditCard.js';
import Header from './components/Header.js';
import AddCardDrawer from './components/mui_components/AddCardDrawer.js';
import React, { Component } from 'react';
import BottomNav from './components/mui_components/BottomNav.js';
import CardList from './components/mui_components/CardList.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      display : 'rendering',
      selectedCard : 0,
      newCardSuccess: false,
      tableData: [],
      cardList: [], 
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

  handleCardListItemClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    this.setState({selectedCard: this.state.cardList.find(e=>e._id===id)});
  }

  componentDidMount = async () => {
    let response = await fetch('/verify');
    let data = await response.json();
    if(!data.isLoggedIn){
      this.setState({display:'welcome'});
    }else{
      response = await fetch('/cards');
      data = await response.json();
      this.setState({display:'homepage',cardList: data.entries, selectedCard: data.entries[0]});
    }
  }

  handleAddNewCardSuccess = async () => {
    let response = await fetch('/lastcard');
    let data = await response.json();
    this.setState({
      cardList: [...this.state.cardList, data.entry[0]],
      newCardSuccess: true,
      drawerOpen: false
    })
  }

  render () {
    const {display, selectedCard, cardList} = this.state;
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
            <CreditCard card={selectedCard}/>
            <CardList cardList={cardList} handleCardListItemClick={this.handleCardListItemClick}/>
            <AddCardDrawer 
              open={this.state.drawerOpen} 
              handleDrawerClose={()=>this.setState({drawerOpen: false})}
              handleAddNewCardSuccess={this.handleAddNewCardSuccess}
            />
            <Snackbar
              open={this.state.newCardSuccess}
              autoHideDuration={2000}
              onClose={()=>this.setState({newCardSuccess: false})}
              message="Card Added"
              sx={{justifyContent: 'center'}}
            >
              <Alert sx={{width: "50%", background: "#0C0D0B", color: 'white'}}>
                Card Added
              </Alert>
            </Snackbar>
            <BottomNav 
              handleAddCard={()=>this.setState({drawerOpen: true})}
            />
          </div>
        );
    }
  }
}

export default App;
