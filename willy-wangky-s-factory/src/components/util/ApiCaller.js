import axios from "axios"
import { WSFACTORY_ENDPOINT, WSSUPPLIER_ENDPOINT } from "../util/context"
import { createEnvelope, displayFactoryError } from "../util/envelope"
import { NotificationManager } from "react-notifications"

export function getBalance(token, callBack, errCallBack=()=>{}) {
  axios.post(`${WSFACTORY_ENDPOINT}/saldo?wsdl`,
    createEnvelope("getSaldo"),
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
      const balance = xml.getElementsByTagName("return")[0].textContent
      callBack(balance)
    }
  })
  .catch(err => {
    errCallBack()
    console.log("Error happened when loading saldo")
    console.log(err)
  })
}

export function orderSupplies(user, data, balance=0, callBack=()=>{}) {
  data.balance = balance || data.balance
  axios.post(`${WSSUPPLIER_ENDPOINT}/materials/buy`, 
    data,
    {
      headers: {
        "WSS-APITOKEN": user.auth,
      }
    },
  )
  .then(res => {
    if (res.status == 200) {
      let newBal = res.data.data.final_balance
      addSupplies(user, data.supplies, newBal, callBack)
    }
  })
  .catch(err => {
    NotificationManager.error(`Balance: Rp. ${data.balance}, Lack: Rp. ${err.response.data.data.needed}`, "Insufficient Balance")
    user.changeBalance(data.balance)
    callBack()
  })
}

function addSupplies(user, supplies, balance, callBack=()=>{}) {
  axios.post(`${WSFACTORY_ENDPOINT}/ingredient?wsdl`, 
    createEnvelope("addSupplies", {
      saldo: balance,
      supplies: supplies,
    }),
    {
      headers: {
        "WSF-APITOKEN": user.auth,
        "Content-Type": "text/xml",
      }
    },
  )
  .then(res => {
    if (res.status == 200) {
      NotificationManager.success(`Your balance has been updated into Rp. ${balance}. Check your storage!`, "Add Supplies Success")
      user.changeBalance(balance)
      callBack()
    }
  })
  .catch(err => {
    displayFactoryError("Add Supplies Failed", err)
    callBack()
  })
}