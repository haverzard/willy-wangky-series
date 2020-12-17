import React from "react"
import axios from "axios"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { NotificationManager } from "react-notifications"
import { UserContext, WSFACTORY_ENDPOINT } from "../context"
import { createEnvelope, displayFactoryError } from "../envelope"

export default class RestockChocolate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0
    }
    this.handleChange = (e) =>{ 
      if (e.target.value.indexOf(".") == -1) {
        this.setState({amount: e.target.value})
      }
    }
    this.handleRestock = (e, token) => {
      if (this.state.amount > 0) {
        e.preventDefault()
        axios.post(`${WSFACTORY_ENDPOINT}/chocolate`, 
          createEnvelope("restockChocolate", { id: this.props.chocolate.id , amountToCreate: this.state.amount }),
          {
            headers: {
              "WSF-APITOKEN": token,
              "Content-Type": "text/xml",
            }
          },
        )
        .then(res => {
          if (res.status == 200) {
            NotificationManager.success("Your chocolate's restock request has been fulfilled", "Restock Success")
            this.props.loadChocolates(token)
          }
        })
        .catch(err => {
          displayFactoryError("Restock Failed", err)
        })
      }
    }
  }

  render() {
    return (
      <UserContext>
        {user => (
          <Modal show={this.props.show} onHide={() => this.props.callback()}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.chocolate.name}</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                  <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" value={this.state.amount} min="1" onChange={this.handleChange}
                      placeholder="How many chocolates do you want to create?" required />
                    <Form.Text className="text-muted">
                      Make sure it's positive!
                    </Form.Text>
                  </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={(e) => this.handleRestock(e, user.auth)}>
                  Restock
                </Button>
              </Modal.Footer>
              </Form>
          </Modal>
        )}
      </UserContext>
    )
  }
}