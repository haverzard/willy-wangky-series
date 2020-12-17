var valid = {"password": true, "email": true, "username": true, "register": true}

function callError() {
    var error = document.getElementById("form-error-box")
    error.textContent = ""
    if (!valid["register"]) {
        var temp = document.createElement("li")
        temp.textContent = "Registration failed"
        error.appendChild(temp);
    }
    if (!valid["email"]) {
        var temp = document.createElement("li")
        temp.textContent = "Someone already used the email"
        error.appendChild(temp);
    }
    if (!valid["username"]) {
        var temp = document.createElement("li")
        temp.textContent = "Someone already used the username"
        error.appendChild(temp);
    }
    if (!valid["password"]) {
        var temp = document.createElement("li")
        temp.textContent = "Please enter the same password"
        error.appendChild(temp);
    }
}

function checkPassword() {
    var confirmPassword = document.getElementById("confirm_password")
    var password = document.getElementById("password")
    confirmPassword.classList.toggle("form-input-error", confirmPassword.value != password.value)
    password.classList.toggle("form-input-valid", password.value && confirmPassword.value == password.value)
    confirmPassword.classList.toggle("form-input-valid", password.value && confirmPassword.value == password.value)
    valid["password"] = confirmPassword.value == password.value
    callError()
}

function checkEmail(async=true) {
    var email = document.getElementById("email")
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText)
            email.classList.toggle("form-input-error", res["data"])
            email.classList.toggle("form-input-valid", !res["data"])
            valid["email"] = !res["data"]
            callError()
        }
    }
    xhr.open("GET", "/api/users/email_lookup?value="+email.value, async)
    xhr.send()
}

function checkUsername(async=true) {
    var username = document.getElementById("username")
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText)
            username.classList.toggle("form-input-error", res["data"])
            username.classList.toggle("form-input-valid", !res["data"])
            valid["username"] = !res["data"]
            callError()
        }
    }
    xhr.open("GET", "/api/users/username_lookup?value="+username.value, async)
    xhr.send()
}

function callRegister(e) {
    e.preventDefault()
    valid["register"] = true
    var username = document.getElementById("username").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var res = JSON.parse(this.responseText)
            if (this.status == 201) {
                location.href = "/"
            } else {
                valid["register"] = false
                callError()
            }         
        }
    }
    xhr.open("POST", "/api/users/register")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`username=${username}&email=${email}&password=${password}`)
}

function goLogin() {
    location.href = "/login"
}

checkEmail()
checkPassword()
checkUsername()