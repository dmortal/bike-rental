import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Checkout} from "./components/Checkout";
import {Confirmation} from "./components/Confirmation";
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
        <Route exact path="/" component={Checkout}/>
        <Route path="/confirmation" component={Confirmation}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
