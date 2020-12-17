import React from "react"
import axios from "axios"
import "./ItemListing.min.css"
import { NotificationManager } from "react-notifications"
import { Redirect } from "react-router-dom"
import { UserContext, WSFACTORY_ENDPOINT } from "../util/context"
import { createEnvelope, displayFactoryError } from "../util/envelope"

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      loading: true,
      show: 0,
    }
    this.approveOrder = (token, id) => {
      axios.post(`${WSFACTORY_ENDPOINT}/add-stock-request?wsdl`, 
        createEnvelope("approveAddStockRequest", {id: id}),
        {
          headers: {
            "WSF-APITOKEN": token,
            "Content-Type": "text/xml",
          }
        },
      )
      .then(res => {
        if (res.status == 200) {
          this.loadOrders(token)
          NotificationManager.success("Successfully approve add stock request", "Approval Success")
        }
      })
      .catch(err => {
        displayFactoryError("Approval Failed", err)
      })
    }
    this.loadOrders = (token) => {
      axios.post(`${WSFACTORY_ENDPOINT}/add-stock-request?wsdl`, 
        createEnvelope("getAllAddStockRequests"),
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
          const orders = xml.getElementsByTagName("return")
          let tempOrders = []
          for (let i = 0; i < orders.length; i++) {
            let order = orders[i]
            tempOrders.push({
              "id": order.childNodes[0].textContent,
              "chocolate_name": order.childNodes[2].textContent,
              "amount": order.childNodes[3].textContent,
              "status": order.childNodes[4].textContent,
            })
          }
          this.setState({ orders: tempOrders, loading: false })
        }
      })
      .catch(_ => {
        NotificationManager.error("Factory's web service is down?", "Error loading orders")
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
                {user.auth && this.loadOrders(user.auth)}
                Loading data...
              </div>}
            {!this.state.loading &&
              <div id="Page-title">
                List of Orders
              </div>}
            {!this.state.loading && 
              this.state.orders.map((order, i) => {
              return (
                <div className="Item-container" key={i}>
                  <div className="Item-wrapper">
                    <div className="Item-main">
                      <div>
                        <span className="Item-title">#{order.id}: {order.chocolate_name}</span>
                        <span className="Item-goal">[STATUS - {order.status.toUpperCase()}]</span>
                      </div>
                      <form
                        onSubmit={async (e)=>{
                            e.preventDefault()
                            this.approveOrder(user.auth, order.id)
                        }}>
                        <button className="Item-approval" disabled={order.status != "pending"}>Approve</button>  
                      </form>
                    </div>
                    <br/>
                    <div>
                      <div className="Item-info-title">
                        Information
                      </div>
                      <div className="Item-info-wrapper">
                        <div className="Item-info-key-30">
                          Amount
                        </div>
                        <div className="Item-info-value-70">
                          {order.amount}
                        </div>
                      </div>
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