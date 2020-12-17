function getUrlPartAtPos(idx) {
    return location.pathname.match(/[^/]+/g)[idx]
}

