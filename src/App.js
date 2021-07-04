// src/App.js
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./screens/Home";
import LoginForm from "./screens/LoginForm";

export default function App() {
  return <Router>
    <Route>
      <Header/>
      <Toast/>
    </Route>

    <div className={"overflow-auto mt-20 grid justify-center"}>
      <Switch>
        <Route path="/login">
          <LoginForm/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </div>

    <Route>
      <Footer/>
    </Route>
  </Router>
}
