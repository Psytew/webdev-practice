const socket = io.connect('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
let messageInput = document.getElementById('message-input')

const name = prompt("What is your name?")
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', function(data) {
	appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', function(name) {
	appendMessage(`${name} has connected.`)
})

socket.on('user-disconnected', function(name) {
	appendMessage(`${name} has disconnected.`)
})

messageForm.addEventListener('submit', e => {
	e.preventDefault()
	const message = messageInput.value
	socket.emit('send-chat-message', message)
	messageInput.value = ""
})

function appendMessage(message) {
	const messageElement = document.createElement('div')
	messageElement.innerText = message
	messageContainer.append(messageElement)
}