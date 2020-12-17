import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import MyLink from "./MyLink"
import "bootstrap/dist/css/bootstrap.min.css"
import NavStyles from "./Navbar.module.css"

import { UserContext } from "../context"

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.renderTooltip = (props, balance) => (
      <Tooltip id="button-tooltip" {...props}>
        Rp. {balance}
      </Tooltip>
    )
  }
  render() {
    return (
      <div id={NavStyles["navbar-wrapper"]}>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Willy's Wangky Factory</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <MyLink to="/" title="Home" />
              <MyLink to="/chocolates" title="Chocolates" />
              <MyLink to="/ingredients-supplier" title="Ingredients Supplier" />
              <MyLink to="/storage" title="Storage" />
              <MyLink to="/supply" title="Order Supply" />
            </Nav>
            <UserContext.Consumer>
              {user => (
                <Nav>
                  {user.auth ? (
                    <>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => this.renderTooltip(props, user.balance)}
                      >
                        <div className="nav-link" id={NavStyles["navbar-balance-container"]}>Show Balance</div>
                      </OverlayTrigger>

                      <MyLink to="/logout" title="Logout" />
                    </>
                  ) : (
                    <>
                      <MyLink to="/login" title="Login" />
                    </>
                  )}
                </Nav>
              )}
            </UserContext.Consumer>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}
