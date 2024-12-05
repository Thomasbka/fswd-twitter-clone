import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./Homepage";
import Layout from "./Layout";
import Feeds from "./Feeds";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/feeds" component={Feeds} />
      </Switch>
    </Router>
  );
};

export default App;
