import React from "react"

export const WSFACTORY_ENDPOINT = "http://localhost:8080/wsfactory-1.0-SNAPSHOT"
export const WSSUPPLIER_ENDPOINT = "http://localhost:3030"

export const UserContext = React.createContext({
  auth: "",
  balance: -1,
  changeAuth: () => {},
  changeBalance: () => {},
})
