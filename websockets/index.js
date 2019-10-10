var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
    console.log("listening to requests on port 4000");
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    console.log("Made connection with " + socket.id);

    socket.on('chat',function(data){
        io.emit('chat', data);
    });

    socket.on('typing',function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('notTyping',function(){
        console.log("oi")
        socket.broadcast.emit('notTyping');
    });
});