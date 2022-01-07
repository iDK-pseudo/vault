import './App.css';
import Card from './components/Card.js';
import Header from './components/Header.js';
import Table from './components/Table.js';
import Form from './components/Form.js';
import React, { useState } from 'react';

function App() {

  const [displayForm, setDisplayForm] = useState(false);

  function handleNewItemClick () {
    setDisplayForm(true);
  }

  if(!displayForm){
    return (
      <div>
        <Header/>
        <Card/>
        <Table onClickNewItem={handleNewItemClick}/>
      </div>
    );
  }else{
    return (
      <div>
        <Header/>
        <Form/>
      </div>
    )
  }
  
}

export default App;
