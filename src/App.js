import './App.css';
import Card from './components/Card.js';
import Header from './components/Header.js';
import Table from './components/Table.js';
import Form from './components/Form.js';
import React, { useState } from 'react';

function App() {

  const [displayForm, setDisplayForm] = useState(false);

  function showForm () {
    setDisplayForm(true);
  }

  function hideForm() {
    setDisplayForm(false);
  }

  if(!displayForm){
    return (
      <div>
        <Header/>
        <Card/>
        <Table onClickNewItem={showForm}/>
      </div>
    );
  }else{
    return (
      <div>
        <Header/>
        <Form onNewEntrySuccess={hideForm} handleBackClick={hideForm}/>
      </div>
    )
  }
  
}

export default App;
