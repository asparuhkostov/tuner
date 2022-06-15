import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home";

const MainRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<MainRouter />, document.getElementById("root"));
