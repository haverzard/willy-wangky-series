var logHistory = {}
var totalPrice = 0

function triggerMaterial(id, idx) {
    var oldAmount = logHistory[id] | 0
    var amount = document.getElementById("material-"+id).value
    var material = materials[idx]
    totalPrice -= material['price'] * oldAmount
    totalPrice += material['price'] * amount
    logHistory[id] = amount
    document.getElementById("materials_total_price").textContent = totalPrice
}

function addChocolate(e) {
    var count = 0
    for (var k in logHistory) {
        if (logHistory[k] != 0) {
            count++;
        }
    }
    if (count == 0) {
        e.preventDefault()
        alert("Please enter material for the chocolate")
    }
}