import React from "react"
import Nav from "react-bootstrap/Nav"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import NavStyles from "./Navbar.module.css"

export default class MyLink extends React.Component {

  render() {
    return (
      <Link className="nav-link" to={this.props.to}>
        <div className={NavStyles["link"]}>
          {this.props.title}
        </div>
      </Link>
    )
  }
}