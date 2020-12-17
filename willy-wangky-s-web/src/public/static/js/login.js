function callError() {
    var error = document.getElementById("form-error-box")
    error.textContent = ""
    var temp = document.createElement("li")
    temp.textContent = "Login failed"
    error.appendChild(temp);
}

function callLogin(e) {
    e.preventDefault()
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var res = JSON.parse(this.responseText)
            console.log(this.getAllResponseHeaders())
            if (this.status == 200) {
                location.href = "/"
            } else {
                callError()
            }
        }
    }
    xhr.open("POST", "/api/users/login")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`email=${email}&password=${password}`)
}

function goRegister() {
    location.href = "/register"
}