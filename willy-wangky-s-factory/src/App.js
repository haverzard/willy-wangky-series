import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import "react-notifications/lib/notifications.css"
import { NotificationContainer } from "react-notifications"
import axios from "axios"
import "./components/pages/ItemListing.min.css"
import { UserContext, WSFACTORY_ENDPOINT } from "./components/util/context"
import Header from "./components/util/Navigation/Header"
import Home from "./components/pages/Home"
import Chocolates from "./components/pages/Chocolates"
import IngredientsSupplier from "./components/pages/IngredientsSupplier"
import Storage from "./components/pages/Storage"
import OrderSupply from "./components/pages/OrderSupply"
import Login from "./components/pages/Login"
import Logout from "./components/pages/Logout"
import { createEnvelope } from "./components/util/envelope"
import { getBalance } from "./components/util/ApiCaller"

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      auth: "",
      balance: -1,
      loading: true,
    }
    this.changeAuth = (value) => {
      localStorage.setItem("WSF-APITOKEN", value)
      this.setState({ auth: value })
    }
    this.changeBalance = (value) => {
      this.setState({ balance: value })
    }
  }

  componentDidMount() {
    let token = localStorage.getItem("WSF-APITOKEN")
    getBalance(token, (balance) => {
      this.setState({ auth: token, balance: balance, loading: false })
    }, (_) => {
      this.setState({ auth: null, loading: false })
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Router>
            <Header />
          </Router>
          <div id="Page-loading">
            Loading authorization...
          </div>
        </div>
      )
    }
    return (
      <UserContext.Provider value={{
        auth: this.state.auth,
        balance: this.state.balance,
        changeAuth: this.changeAuth,
        changeBalance: this.changeBalance}}>
        <Router basename="/">
          <div>
            <Header />

            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/chocolates">
                <Chocolates />
              </Route>
              <Route path="/ingredients-supplier">
                <IngredientsSupplier />
              </Route>
              <Route path="/supply">
                <OrderSupply />
              </Route>
              <Route path="/storage">
                <Storage />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
        <NotificationContainer/>
      </UserContext.Provider>
    )
  }
}
