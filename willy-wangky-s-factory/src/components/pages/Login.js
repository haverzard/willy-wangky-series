import React from "react"
import "./ItemListing.min.css"
import "./CustomForm.css"
import axios from "axios"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { Redirect } from "react-router-dom"
import { UserContext, WSFACTORY_ENDPOINT } from "../util/context"
import { createEnvelope, displayFactoryError } from "../util/envelope"
import { getBalance } from "../util/ApiCaller"
import { NotificationManager } from "react-notifications"

export default class OrderSupply extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
    }
    this.handleUsername = (e) => {
      this.setState({ username: e.target.value })
    }
    this.handlePassword = (e) => {
      this.setState({ password: e.target.value })
    }
    this.handleLogin = (e, user) => {
      if (this.state.username && this.state.password) {
        e.preventDefault()
        axios.post(`${WSFACTORY_ENDPOINT}/user?wsdl`,
          createEnvelope("login", { username: this.state.username, password: this.state.password}),
          { 
            headers: {
              "Content-Type": "text/xml; charset=utf-8",
            }
          }
        )
        .then(res => {
          if (res.status == 200) {
            const parser = new DOMParser()
            const xml = parser.parseFromString(res.data, "text/xml")
            const token = xml.getElementsByTagName("return")[0].textContent
            getBalance(token, (balance)=> {
              user.changeBalance(balance)
              user.changeAuth(token)
            })
          }
        })
        .catch(err => {
          if (err.response) {
            displayFactoryError("Login Failed", err)
          } else {
            NotificationManager.error("Factory's web service is down?", "Login Failed")
          }
        })
      }
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <UserContext.Consumer>
        {user => (
          <div id="Items-wrapper">
            {user.auth && <Redirect to="/" />}
            <div id="Page-title">
            Login
            </div>
              <div style={{"width": "80%"}}>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username"
                      onChange={this.handleUsername}
                      value={this.state.username}
                      required />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password"
                      onChange={this.handlePassword}
                      value={this.state.password}
                      required />
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={(e) => this.handleLogin(e, user)}>
                    Submit
                  </Button>
                </Form>
            </div>
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}