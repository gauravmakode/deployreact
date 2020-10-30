import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import TopicFilter from "./sheet/TopicFilter";
import TopicSheet from "./sheet/TopicSheet";
import TestFilter from "./test/TestFilter";
import CompletedSheets from "./sheet/CompletedSheets";
import CompletedTestPapers from "./test/CompletedTestPapers";
import TestPaper from "./test/TestPaper";
import TestAnalysis from "./test/TestAnalysis";
import Logout from "./components/Logout";
import CustomNavbar from "./components/Navbar";
import "./App.css";
function App() {
  return (
    <Router>
      <CustomNavbar />
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/logout" component={Logout} />
          <Route path="/topicfilter" component={TopicFilter} />
          <Route path="/completedsheets" component={CompletedSheets} />
          <Route path="/topicsheet" component={TopicSheet} />
          <Route path="/testfilter" component={TestFilter} />
          <Route path="/completedtestpapers" component={CompletedTestPapers} />
          <Route path="/testpaper" component={TestPaper} />
          <Route path="/testanalysis" component={TestAnalysis} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
