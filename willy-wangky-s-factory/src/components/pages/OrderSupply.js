import React from "react"
import axios from "axios"
import "./ItemListing.min.css"
import "./CustomForm.css"
import { NotificationManager } from "react-notifications"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { Redirect } from "react-router-dom"
import { UserContext, WSSUPPLIER_ENDPOINT } from "../util/context"
import { getBalance, orderSupplies } from "../util/ApiCaller"

export default class OrderSupply extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      title: "",
      description: "",
      deadline: "",
      goal: "",
      disabled: false,
      ingredients: [["", 0]],
      availables: [],
    }
    this.form = React.createRef()
    this.handleInput = async (e) =>{
        e.preventDefault()
        alert("We received your transaction")
    }
    this.handleID = (e, i) => {
      let valid = true
      this.state.ingredients.forEach((ingredient) => {
        if (valid && ingredient[0] == e.target.value) {
          valid = false
        }
      })
      this.state.ingredients[i][0] = valid ? e.target.value : 0
      this.setState({ingredients: [...this.state.ingredients] })
    }
    this.handleAmount = (e, i) => {
      if (e.target.value.indexOf(".") == -1) {
        this.state.ingredients[i][1] = e.target.value
        this.setState({ingredients: [...this.state.ingredients] })
      }
    }
    this.handleCross = (e, i) => {
      e.preventDefault()
      if (this.state.ingredients.length > 1) {
        this.setState({ingredients: [...this.state.ingredients.filter((_,idx) => idx !== i)] })
      }
    }
    this.handleSubmit = (e, user) => {
      this.setState({ disabled: true })
      let valid = true
      this.state.ingredients.forEach((ingredient) => {
        if (valid && (!ingredient[0] || ingredient[1] <= 0)) {
          valid = false
        }
      })

      if (valid) {
        e.preventDefault()
        let data = { balance: user.balance, supplies: [] }
        let ingredients = {}
        this.state.availables.forEach(ingredient => {
          ingredients[ingredient.id] = ingredient.name
        })
        this.state.ingredients.forEach(([id, amount]) => {
          data.supplies.push({
            id: id,
            amount: amount,
            name: ingredients[id],
          })
        })
        getBalance(user.auth, (balance) => orderSupplies(user, data, balance, () => this.setState({ disabled: false }) ))
      } else {
        this.setState({ disabled: false })
      }
    }
    this.loadMaterials = (token) => {
      axios.get(`${WSSUPPLIER_ENDPOINT}/materials`)
      .then(res => {
        if (res.status == 200) {
          this.setState({ loading: false, availables: res.data })
        }
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
                {this.loadMaterials(user.auth)}
                Loading data...
              </div>}
            {!this.state.loading &&
              <div id="Page-title">
                Order Supply
              </div>}
            {!this.state.loading && 
              // <div style={{"width": "100%"}}>
              <Form style={{"width": "80%"}} ref={this.form}>
                <Form.Label>Materials</Form.Label>
                {this.state.ingredients.map((p,i) => {
                    return (
                        <div className="Form-container" key={i}>
                          <button className="Form-cross" onClick={(e) => this.handleCross(e, i)}>
                            <span role="img" aria-label="cross">❌</span>
                          </button>
                          {/* <input className="Form-input-left" type="text" required
                            /> */}
                          <Form.Control as="select" className="Form-input-left" required
                            onChange={(e) => this.handleID(e,i)} value={p[0]}>
                            <option value="">Choose your material</option>
                            {this.state.availables.map((ingredient, j) => {
                              return (
                                <option key={j} value={ingredient.id}>{ingredient.name}</option>
                              )
                            })}
                          </Form.Control>
                          <input className="Form-input-right" type="number" min="1"
                            placeholder="Material's amount" value={p[1]} required
                            onChange={(e) => this.handleAmount(e,i)} />
                        </div>
                    )
                })}
                <div className="Form-button"
                  onClick={() =>
                    this.setState({ingredients: [...this.state.ingredients, ["", 0]] })
                  }>
                  <span role="img" aria-label="plus">➕ Add Supply</span>
                </div>

                <Button variant="primary" type="submit" onClick={(e) => this.handleSubmit(e, user)} disabled={this.state.disabled}>
                  Order Now
                </Button>
              </Form>
            }
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}