function startUpdating(chocoId, onSucceedCallback, onErrorCallback) {
    console.log('started')
    setInterval(function() {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // console.log(this.responseText)
                    onSucceedCallback(this.responseText)
                } else {
                    // console.log(this.responseText)
                    onErrorCallback(this.response)
                }
            }
        }
        // /api/chocolates/([1-9]+)/
        xhr.open("GET", "/api/chocolates/" + chocoId)
        xhr.send()
    }, 1000)
}
