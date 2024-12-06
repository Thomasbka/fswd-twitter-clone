import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./Homepage";
import Layout from "./Layout";
import Feeds from "./Feeds";
import UserTweets from "./UserTweets";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/feeds" component={Feeds} />
        <Route path="/users/:username" component={UserTweets} />
      </Switch>
    </Router>
  );
};

export default App;
