import React from "react"
import axios from "axios"
import "./ItemListing.min.css"
import { NotificationManager } from "react-notifications"
import RestockChocolate from "../util/Form/RestockChocolate"
import { Redirect } from "react-router-dom"
import { UserContext, WSFACTORY_ENDPOINT } from "../util/context"
import { createEnvelope } from "../util/envelope"

export default class Chocolates extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chocolates: [],
      recipes: {},
      loading: true,
      pointer: 0,
    }
    this.showForm = (id) => {
      this.setState({ pointer: id })
    }
    this.loadChocolates = (token) => {
      axios.post(`${WSFACTORY_ENDPOINT}/chocolate?wsdl`,
        createEnvelope("getAllChocolates"),
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
          const chocolates = xml.getElementsByTagName("return")
          this.state.chocolates = []
          for (let i = 0; i < chocolates.length; i++) {
            let chocolate = chocolates[i]
            this.state.chocolates.push({
              "id": chocolate.childNodes[0].textContent,
              "name": chocolate.childNodes[1].textContent,
              "stock": chocolate.childNodes[2].textContent,
            })
          }
          this.setState({ loading: false })
        }
      })
      .catch(_ => {
        NotificationManager.error("Factory's web service is down?", "Error loading chocolates")
      })
      axios.post(`${WSFACTORY_ENDPOINT}/recipe?wsdl`,
        createEnvelope("getAllRecipes"),
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
          const recipes = xml.getElementsByTagName("return")
          let recipesContainer = {}
          for (let i = 0; i < recipes.length; i++) {
            let firstRecipe = recipes[i].childNodes[0]
            if (firstRecipe) {
              let chocoId = firstRecipe.firstChild.textContent
              let singleRecipes = recipes[i].childNodes
              recipesContainer[chocoId] = []
              for (let j = 0; j < singleRecipes.length; j++) {
                let singleRecipe = singleRecipes[j]
                let name = singleRecipe.getElementsByTagName("name")[0].textContent
                let amount = singleRecipe.getElementsByTagName("amount")[0].textContent
                recipesContainer[chocoId].push({
                  "name": name,
                  "amount": amount,
                })
              }
            }
          }
          this.setState({ recipes: recipesContainer })
        }
      })
      .catch(_ => {
        NotificationManager.error("Factory's web service is down?", "Error loading recipes")
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
                {user.auth && this.loadChocolates(user.auth)}
                Loading data...
              </div>}
            {!this.state.loading &&
              <div id="Page-title">
                List of Chocolates
              </div>}
            {!this.state.loading &&
              this.state.chocolates.map((chocolate, i) => {
              return (
                <div className="Item-container" key={i}>
                  <RestockChocolate
                    chocolate={chocolate}
                    loadChocolates={this.loadChocolates}
                    show={chocolate.id == this.state.pointer}
                    callback={() => this.showForm(0)} />
                  <div className="Item-wrapper">
                    <div className="Item-main">
                      <div>
                        <span className="Item-title">{chocolate.name}</span>
                        <span className="Item-goal">[Stock: {chocolate.stock}]</span>
                      </div>
                      <button className="Item-approval" onClick={() => this.showForm(chocolate.id)}>Restock</button>
                    </div>
                    <br/>
                    <div>
                      <div className="Item-info-title">
                        Recipe
                      </div>
                      <div className="Item-info-wrapper">
                          <div className="Item-info-header-50">
                            Name
                          </div>
                          <div className="Item-info-header-50">
                            Amount
                          </div>
                      </div>
                      {this.state.recipes[chocolate.id] &&
                        this.state.recipes[chocolate.id].map((ingredient, j)=> {
                        return (
                          <div className="Item-info-wrapper" key={j}>
                            <div className="Item-info-key-50">
                              {ingredient.name}
                            </div>
                            <div className="Item-info-value-50">
                              {ingredient.amount}
                            </div>
                        </div>
                        )
                      })}
                    </div>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}
