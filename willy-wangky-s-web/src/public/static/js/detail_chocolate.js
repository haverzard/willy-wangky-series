// start ajax request
function updateSucceed(res) {
    res = JSON.parse(res)
    document.getElementById("sold").innerHTML = res.data.sold.toString()
    document.getElementById("stock").innerHTML = res.data.stock.toString()
}

function updateFailed(res) {
    console.log("Failed to update chocolate data. Error: " + JSON.parse(res).message)
}

startUpdating(getUrlPartAtPos(1), updateSucceed, updateFailed)
