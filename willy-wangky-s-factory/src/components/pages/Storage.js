import React from "react"
import axios from "axios"
import "./ItemListing.min.css"
import { NotificationManager } from "react-notifications"
import { Redirect } from "react-router-dom"
import { UserContext, WSFACTORY_ENDPOINT } from "../util/context"
import { createEnvelope } from "../util/envelope"

export default class Storage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: [],
      loading: true,
    }
    this.loadStorage = (token) => {
      axios.post(`${WSFACTORY_ENDPOINT}/ingredient?wsdl`, 
        createEnvelope("getAllIngredients"),
        {
          headers: {
            "WSF-APITOKEN": token,
            "Content-Type": "text/xml",
          }
        },
      )
      .then(res => {
        if (res.status == 200) {
          const parser = new DOMParser()
          const xml = parser.parseFromString(res.data, "text/xml")
          const ingredients = xml.getElementsByTagName("return")
          for (let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i]
            this.state.ingredients.push({
              "id": ingredient.childNodes[0].textContent,
              "name": ingredient.childNodes[2].textContent,
              "stock": ingredient.childNodes[3].textContent,
              "expdate": ingredient.childNodes[4].textContent,
            })
          }
          this.setState({ loading: false })
        }
      })
      .catch(_ => {
        NotificationManager.error("Factory's web service is down?", "Error loading ingredients")
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
                Supply Storage
              </div>}
            {!this.state.loading && 
              <div className="Item-container-clean">
                <div className="Item-info-title">
                  Ingredients
                </div>
                <div className="Item-info-wrapper">
                  <div className="Item-info-header-40">
                    Name
                  </div>
                  <div className="Item-info-header-30">
                    Amount
                  </div>
                  <div className="Item-info-header-30">
                    Expire Date
                  </div>
                </div>  
                {this.state.ingredients.map((ingredient, i)=> {
                  return (
                    <div className="Item-info-wrapper" key={i}>
                      <div className="Item-info-key-40">
                        {ingredient.name}
                      </div>
                      <div className="Item-info-value-30">
                        {ingredient.stock}
                      </div>
                      <div className="Item-info-key-30">
                        {ingredient.expdate}
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