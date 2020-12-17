import { NotificationManager } from "react-notifications"

function serializeXML(wrapper, objects) {
  let template = ""
  objects.forEach((object) => {
    template += `<${wrapper}>`
    for (var key in object) {
      if (object[key] instanceof Array) {
        template += serializeXML(key, object[key])
      } else {
        template += `<${key}>${object[key]}</${key}>`
      }
    }
    template += `</${wrapper}>`
  })
  return template
}

export function createEnvelope(myFunction, args={}) {
  let template = ""
  for (var key in args) {
    if (args[key] instanceof Array) {
      template += serializeXML(key, args[key])
    } else {
      template += `<${key}>${args[key]}</${key}>`
    }
  }
  return `
    <x:Envelope
      xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:ser="http://interfaces.services.ws.factory.tubes.wbd.com/">
      <x:Header/>
      <x:Body>
      <ser:${myFunction}>
      `+template+`
      </ser:${myFunction}>
      </x:Body>
    </x:Envelope>
  `
}

export function displayFactoryError(title, err) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(err.response.data, "text/xml")
  NotificationManager.error(xml.getElementsByTagName("message")[0].textContent, title)
}