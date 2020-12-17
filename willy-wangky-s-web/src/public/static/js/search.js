var name = document.getElementById("search-name").value
var pageLoc = 1
function getChocolates(page, async=true) {
    var pageNumbers = document.getElementsByClassName("page_number")
    pageNumbers[pageLoc-1].classList.toggle("active-page", false)
    pageNumbers[page-1].classList.toggle("active-page", true)
    pageLoc = page
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var searchContainer = document.getElementById("chocolates-search-container")
            searchContainer.innerHTML = ""
            var res = JSON.parse(this.responseText)['data'];
            res.forEach((chocolate) => {
                var container = document.createElement("div")
                container.className = "chocolate-search-container"
                container.onclick = () => location.href = '/detail_chocolate/'+chocolate['id']
                searchContainer.appendChild(container)

                var imageBox = document.createElement("div")
                imageBox.className = "chocolate-search-image"
                container.appendChild(imageBox)

                var image = document.createElement("img")
                image.className = "chocolate-search-img"
                image.src = `/static/images/chocolates/chocolate_${chocolate['id']}.${chocolate['image_file_type']}`
                image.onerror = function() {
                    this.onerror=null;
                    this.src="/static/images/chocolates/default_choco.jpg";
                }
                image.alt = chocolate['name']
                imageBox.appendChild(image)

                var desc = document.createElement("div")
                desc.className = "chocolate-search-desc"
                container.appendChild(desc)

                var title = document.createElement("h2")
                title.textContent = chocolate['name']
                desc.appendChild(title)

                var info = document.createElement("div")
                info.className = "chocolate-search-info"
                desc.appendChild(info)

                var amountSold = document.createElement("p")
                amountSold.textContent = "Amount sold	: "+chocolate['sold']
                info.appendChild(amountSold)

                var price = document.createElement("p")
                price.textContent = `Price		: Rp.${chocolate['price']},00`
                info.appendChild(price)

                var amountRemaining = document.createElement("p")
                amountRemaining.textContent = "Amount remaining: "+chocolate['stock']
                info.appendChild(amountRemaining)

                var description = document.createElement("p")
                description.textContent = "Description	:"
                info.appendChild(description)

                var descriptionValue = document.createElement("p")
                descriptionValue.textContent = chocolate['description']
                info.appendChild(descriptionValue)
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
    xhr.open("GET", "/api/chocolates/find?page="+page+"&name="+name, async)
    xhr.send()
}

getChocolates(1, false)
var nav = document.getElementById("page-nav")
nav.classList.toggle("hidden")
nav.classList.toggle("flex")
document.getElementById('nav-search').value = name
