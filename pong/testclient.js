var io = require('socket.io-client');
socket = io.connect('http://localhost:1337')
socket.on('data', function(data) {
    console.log(data);
});
socket.on('getplayercount', function(data) {
    console.log(data);
});
socket.on('paddlemoved', function(data) {
    console.log(data);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(data) {
    var eventType = data.split(" ")[0];
    socket.emit(eventType, data);
});