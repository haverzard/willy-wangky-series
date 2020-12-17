function createEnvelope(myFunction, args={}) {
  let template = ""
  for (var key in args) {
    template += `<${key}>${args[key]}</${key}>`
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
