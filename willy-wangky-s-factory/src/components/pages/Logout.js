import React from "react"
import { Redirect } from "react-router-dom"
import { UserContext } from "../util/context"

export default class Logout extends React.Component {
  render() {
    return (
      <UserContext.Consumer>
        {user => (
          <div id="Items-wrapper">
            {user.changeAuth(null)}
            <Redirect to="/" />
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}