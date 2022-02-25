import './App.css';
import CreditCard from './components/mui_components/CreditCard.js';
import Header from './components/Header.js';
import AddCardDrawer from './components/mui_components/AddCardDrawer.js';
import React, { Component } from 'react';
import BottomNav from './components/mui_components/BottomNav.js';
import CardList from './components/mui_components/CardList.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoginScreen from './components/mui_components/LoginScreen.js';
import APIUtils from './api/APIUtils.js'
import CircularProgress from '@mui/material/CircularProgress';
import SignUpScreen from './components/mui_components/SignUpScreen.js';
import PinDrawer from './components/mui_components/PinDrawer.js';
import GetStarted from './components/mui_components/GetStarted.js';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      display : 'rendering',
      selectedCard : 0,
      newCardSuccess: false,
      cardList: [], 
      addCardDrawerOpen: false,
      pinDrawerOpen: false
    }
  }

  showForm = () => {
    this.setState({display: 'form'});
  }

  hideForm = () => {
    this.setState({display: 'homepage'});
  }

  handleLoginSuccess = async () => {
    const entries = await APIUtils.getCardList();
    if(entries.length===0){
      this.setState({display:'getStarted'});
    }else{
      this.setState({display:'homepage', cardList: entries, selectedCard: entries[0]});
    }
  }

  handleLogout = async () => {
    const isLoggedOut = APIUtils.logoutUser();
    if(isLoggedOut){
      this.setState({
        display: "login",
        selectedCard : 0,
        newCardSuccess: false,
        cardList: [], 
        addCardDrawerOpen: false,
        pinDrawerOpen: false
      });
    } 
  }   

  handleCardListItemClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    this.setState({selectedCard: this.state.cardList.find(e=>e._id===id)});
  }

  handlePinVerFailed = async () => {
    if(await APIUtils.lockUser()){
      this.setState({
        display: "login",
        selectedCard : 0,
        newCardSuccess: false,
        cardList: [], 
        addCardDrawerOpen: false,
        pinDrawerOpen: false
      });
    }
  }

  componentDidMount = async () => {
    if(!await APIUtils.verifyUser()){
      this.setState({display:'login'});
    }else{
      this.handleLoginSuccess();
    }
  }

  handleAddNewCardSuccess = async () => {
    const entry = await APIUtils.getLastCard();
    if(this.state.cardList.length === 0){
      this.setState({
        display: 'homepage',
        cardList: [...this.state.cardList, entry[0]],
        selectedCard: entry[0],
        newCardSuccess: true,
        addCardDrawerOpen: false
      })  
    }else{
      this.setState({
        cardList: [...this.state.cardList, entry[0]],
        newCardSuccess: true,
        addCardDrawerOpen: false
      })
    } 
  }

  render () {
    const {display, selectedCard, cardList} = this.state;
    switch(display){
      case 'rendering':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={display}/>
            <CircularProgress sx={{marginLeft:"40%", marginTop: "70%"}}/>
          </div>
        )
      case 'login':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <LoginScreen handleLoginSuccess={this.handleLoginSuccess} handleSignUpClick={()=>this.setState({display: "signup"})}/>
          </div>
        )
      case 'signup':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <SignUpScreen handleLoginClick={()=>this.setState({display: "login"})} handleSignUpSuccess={()=>this.setState({display: "login"})}/>
          </div>
        )
      case 'getStarted':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <GetStarted/>
            <AddCardDrawer 
              open={this.state.addCardDrawerOpen} 
              handleDrawerClose={()=>this.setState({addCardDrawerOpen: false})}
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
              handleAddCard={()=>this.setState({addCardDrawerOpen: true})}
            />
          </div>
        )
      case 'homepage':
        return (
          <div>
            <Header handleLogout={this.handleLogout} display={this.state.display}/>
            <CreditCard card={selectedCard} handlePinEntry={()=>this.setState({pinDrawerOpen: true})}/>
            <CardList cardList={cardList} handleCardListItemClick={this.handleCardListItemClick}/>
            <AddCardDrawer 
              open={this.state.addCardDrawerOpen} 
              handleDrawerClose={()=>this.setState({addCardDrawerOpen: false})}
              handleAddNewCardSuccess={this.handleAddNewCardSuccess}
            />
            <PinDrawer 
              open={this.state.pinDrawerOpen} 
              handleDrawerClose= {()=> this.setState({pinDrawerOpen: false})}
              handlePinVerFailed={this.handlePinVerFailed}
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
              handleAddCard={()=>this.setState({addCardDrawerOpen: true})}
            />
          </div>
        );
    }
  }
}

export default App;
