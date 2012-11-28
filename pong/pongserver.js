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

var Player = function(name, paddleSize) {
    this.name = name;
    this.side = 'left';
    this.paddleSize = paddleSize || 50;
    this.score = 0;
};

var Game = function(winScore, startSpeed, speedIncFactor) {
    this.players = [];
    this.winScore = winScore || 10;
    this.startSpeed = startSpeed || 4;
    this.speedIncFactor = speedIncFactor || 0.5;
    
    var addPlayer = function(player) {
        if (players.length == 0) {
            this.players.push(player);
        } else if (players.length == 1) {
            player.side = 'right';
            this.players.push(player);
        } else {
            throw "No more room for player.";
        }
    };
};

games = [];
game = new Game();


/* Socket server */
var io = require('socket.io').listen(1337);

sockets = [];
io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    socket.on('data', function(data) {
        socket.emit('data', socket.get('player') + " " + data);
    });
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
});