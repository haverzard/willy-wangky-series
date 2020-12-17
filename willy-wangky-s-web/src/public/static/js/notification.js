let notification_container = document.getElementById('notification-container')
let notification_message = document.getElementById('notification-message')
let notification_close = document.getElementById('notification-close')

function showNotification(message) {
    notification_container.style.display = 'flex'
    notification_message.innerText = message
}

function closeNotification() {
    notification_container.style.display = 'none'
}

notification_close.onclick = closeNotification
