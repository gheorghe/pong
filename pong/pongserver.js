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


/* Game state data structures */
/*
var Player = function(name, paddleSize) {
    this.name = name;
    this.paddleSize = paddleSize;
    this.score = 0;
};

var Game = function(leftPlayer, rightPlayer, winScore, startSpeed, speedIncFactor) {
    this.leftPlayer = leftPlayer;
    this.rightPlayer = rightPlayer;
    this.winScore = winScore || 10;
    this.startSpeed = startSpeed || 4;
    this.speedIncFactor = speedIncFactor || 0.5;
};
*/

/* Socket server */
var io = require('socket.io').listen(1337);

io.sockets.on('connection', function(socket) {
    socket.on('set_nick', function(name) {
        socket.set('nickname', name, function() {
            socket.emit('nick set');
        });
    });
    socket.on('join_game', function(gameName) {
        socket.set('game', gameName);
    });
    socket.on('data', function(data) {
        socket.emit('data', data);
    });
});