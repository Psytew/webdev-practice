var socket = io.connect('http://localhost:4000');

var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById('feedback');

btn.addEventListener('click', function(){
    socket.emit('chat',{
        message: message.value,
        handle: handle.value
    });
    message.value = ""
    socket.emit('notTyping');
});

message.addEventListener('keyup',function(event){
    if (event.keyCode === 13){
        btn.click();
    } else if (message.value !== ""){
        socket.emit('typing',{
            handle: handle.value
        });
    } else {
        socket.emit('notTyping');
    }
});

socket.on('chat', function(data){
    output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>"
});

socket.on('typing', function(data){
    feedback.innerHTML = "<p><em>" + data.handle + " is typing a message...</em></p>" 
});

socket.on('notTyping', function(){
    feedback.innerHTML = "<p><em></em></p>" 
});