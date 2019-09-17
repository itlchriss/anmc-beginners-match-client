import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//components
import MatchSetting from "./components/matchSetting";
import RunMatch from "./components/runMatch";
import SystemSetting from "./components/systemSetting";
import Login from "./components/login";
import Dashboard from "./components/dashboard";

const Menu = () => {
  return <header />;
};

const Main = () => {
  return (
    <main>
      <Switch>
        {/* <Route exact path="/" component={Login} /> */}
        <Route exact path="/" component={MatchSetting} />
        <Route path="/matchSetting" component={MatchSetting} />
        <Route path="/systemSetting" component={SystemSetting} />
        <Route path="/run" component={RunMatch} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </main>
  );
};

const App = () => {
  return (
    <div className="container">
      <Menu />
      <Main />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
