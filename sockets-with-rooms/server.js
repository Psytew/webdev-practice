var express = require('express');
const app = express();

const server = app.listen(3000, function(){
    console.log("Listening to requests on port 3000");
});

const socket = require('socket.io');
var io = socket(server);

app.use(express.static('public'));

const users = {}

io.on('connection', socket => {
	socket.on('new-user', name => {
		users[socket.id] = name
		socket.broadcast.emit('user-connected', name)
	})

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', users[socket.id])
		delete users[socket.id]
	})

	socket.on('send-chat-message', message => {
		io.emit('chat-message', {message, name: users[socket.id] })
	})
})