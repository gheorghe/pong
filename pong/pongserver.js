var http = require('http');

/* Static file server */
var inertia = require('inertia');
var staticServer = inertia.createHandler();
staticServer.useCache = false;
staticServer.addDirHandler('.');
var fileServer = http.createServer(function(req, res) {
    if (staticServer.serve(req, res)) return;
});
fileServer.listen(8000);


/* Game state data structures */
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

/* Game list server */
var games = [];

// test game
playerLeft = new Player("gigi", paddleLeft);
playerRight = new Player("cornel", paddleRight);
game = new Game(playerLeft, playerRight);
games.push(game);

input = [];

function onRequest(req, res) {
    if (req.method === "GET") {
        res.writeHead(200, { 'content-type': 'text/json'});
        res.end(JSON.stringify(games)); 
    } else if (req.method === "POST") {
        var data = "";
        req.addListener("data", function(chunk) { data += chunk; });
        req.addListener("end", function() {
            console.log(data);
            res.writeHead(200, { 'content-type': 'text/plain' });
            res.end();
        });
    }
};

var s = http.createServer(onRequest);

s.listen(8080);