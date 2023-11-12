import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
export const config = {
   endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Products />
        </Route>
        <Route exact path="/checkout">
          <Checkout />
        </Route>
        <Route exact path="/thanks">
          <Thanks />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
