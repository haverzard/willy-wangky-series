function callBuy(e) {
    e.preventDefault()
    let amount = document.getElementById("amount").value
    let address = document.getElementById("address").value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                showNotification('Buy chocolate succeed!')
            } else {
                showNotification('Buy failed! ' + JSON.parse(this.responseText).message)
            }
        }
    }
    // /detail_chocolate/([1-9]*)/buy/
    xhr.open("POST", "/api/chocolates/" + getUrlPartAtPos(1) + "/buy")
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(`amount=${amount}&address=${address}`)
    // reset form
    let form = document.getElementById("buy-form")
    form.reset()
    document.getElementById("total-price").innerHTML = (0).toString()
}

function decAmount() {
    let amount = parseInt(document.getElementById("amount").value)
    amount = isNaN(amount) ? 0 : amount
    document.getElementById("amount").value = amount > 0 ? --amount : 0
    updateTotalPrice()
}

function incAmount() {
    let amount = parseInt(document.getElementById("amount").value)
    let stock = parseInt(document.getElementById("stock").innerHTML)
    amount = isNaN(amount) ? 0 : amount
    document.getElementById("amount").value = amount < stock ? ++amount : amount
    updateTotalPrice()
}

function goBack() {
    // /detail_chocolate/([1-9]*)/buy/
    location.href = "/detail_chocolate/" + getUrlPartAtPos(1)
}

function updateTotalPrice() {
    let price = parseInt(document.getElementById("price").innerHTML)
    price = isNaN(price) ? 0 : price
    let amount = parseInt(document.getElementById("amount").value)
    amount = isNaN(amount) ? 0 : amount
    document.getElementById("total-price").innerHTML = (price * amount).toString()
}

// start ajax request
function updateSucceed(res) {
    res = JSON.parse(res)
    document.getElementById("sold").innerHTML = res.data.sold.toString()
    document.getElementById("stock").innerHTML = res.data.stock.toString()
    let newStock = parseInt(res.data.stock)
    newStock = isNaN(newStock) ? 0 : newStock
    let price = parseInt(document.getElementById("price").innerHTML)
    price = isNaN(price) ? 0 : price
    let amount = parseInt(document.getElementById("amount").value)
    amount = isNaN(amount) ? 0 : amount
    if (amount > newStock) {
        document.getElementById("amount").value = newStock
        document.getElementById("total-price").innerHTML = (price * newStock).toString()
    }
}

function updateFailed(res) {
    console.log("Failed to update chocolate data. Error: " + JSON.parse(res).message)
}

startUpdating(getUrlPartAtPos(1), updateSucceed, updateFailed)
