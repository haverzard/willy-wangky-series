import React from "react"
import axios from "axios"
import "./ItemListing.min.css"
import { NotificationManager } from "react-notifications"
import { Redirect } from "react-router-dom"
import { UserContext,  WSSUPPLIER_ENDPOINT } from "../util/context"

export default class Storage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: [],
      loading: true,
    }
    this.loadStorage = (token) => {
      axios.get(
        `${WSSUPPLIER_ENDPOINT}/materials`,
      )
      .then(res => {
        this.setState({ ingredients: res.data, loading: false })
      })
      .catch(_ => {
        NotificationManager.error("Supplier's web service is down?", "Error loading ingredients")
      })
    }
  }


  render() {
    return (
      <UserContext.Consumer>
        {user => (
          <div id="Items-wrapper">
            {!user.auth && <Redirect to="/login" />}
            {this.state.loading &&
              <div id="Page-loading">
                {user.auth && this.loadStorage(user.auth)}
                Loading data...
              </div>}
            {!this.state.loading &&
              <div id="Page-title">
                Ingredients Supplier
              </div>}
            {!this.state.loading &&
              <div className="Item-container-clean">
                <div className="Item-info-title">
                  Ingredients
                </div>
                <div className="Item-info-wrapper">
                  <div className="Item-info-header-20">
                    ID
                  </div>
                  <div className="Item-info-header-50">
                    Name
                  </div>
                  <div className="Item-info-header-30">
                    Price
                  </div>
                </div>
                {this.state.ingredients.map((ingredient, i)=> {
                  return (
                    <div className="Item-info-wrapper" key={i}>
                      <div className="Item-info-key-20">
                        {ingredient.id}
                      </div>
                      <div className="Item-info-value-50">
                        {ingredient.name}
                      </div>
                      <div className="Item-info-key-30">
                        Rp. {ingredient.price}
                      </div>
                    </div>
                    )
                  })}
              </div>
            }
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}
