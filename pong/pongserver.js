var http = require('http');

/* Static file server */
var inertia = require('inertia');
var staticServer = inertia.createHandler();
staticServer.useCache = false;
staticServer.addDirHandler('.');
var fileServer = http.createServer(function(req, res) {
    if (staticServer.serve(req, res)) return;
});
fileServer.listen(80);

var throwBall = function() {
    var side = Math.random() > 0.5 ? -1 : 1;
    var upordown = Math.random() > 0.5 ? -1 : 1;
    var velocityX = (Math.random() * 2 + 4) * side;
    var velocityY = (Math.random() * 2 + 4) * upordown;
    return { 'velocityX': velocityX, 'velocityY': velocityY };
};

/* Socket server */
var io = require('socket.io').listen(1337);

sockets = [];
io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    socket.on('getplayercount', function() {
        socket.emit('getplayercount', sockets.length);
    });
    socket.on('disconnect', function() {
        sockets.splice(sockets.indexOf(socket), 1);
    });
    socket.on('paddlemoved', function(ypos) {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i] == socket) continue;
            sockets[i].emit('paddlemoved', ypos);
        }
    });
    socket.on('ready', function(ready) {
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i] == socket) continue;
            sockets[i].emit('ready', ready);
        }
    });
    socket.on('start round', function() {
        for (var i = 0; i < sockets.length; i++) {
            sockets[i].emit('update ball', throwBall());
        }
    });
});