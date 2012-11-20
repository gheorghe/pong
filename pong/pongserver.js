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
var PaddleState = function(side, size) {
    this.side = side;
    this.size = size;
    this.x = 0;
    this.y = 0;
};

var BallState = function() {
    this.velocityX = 0;
    this.velocityY = 0;
    this.x = 0;
    this.x = 0;
};

var PlayerState = function(name, paddle) {
    this.name = name;
    this.paddle = paddle;
    this.score = 0;
};

var GameState = function(leftPlayer, rightPlayer, ball,
                         winScore, startSpeed, speedIncFactor) {
    this.leftPlayer = leftPlayer;
    this.rightPlayer = rightPlayer;
    this.ball = ball;
    this.winScore = winScore || 10;
    this.startSpeed = startSpeed || 4;
    this.speedIncFactor = speedIncFactor || 0.5;
};

/* Game list server */
var games = [];

// test game
paddleLeft = new PaddleState("left", 50);
paddleRight = new PaddleState("right", 50);
playerLeft = new PlayerState("gigi", paddleLeft);
playerRight = new PlayerState("cornel", paddleRight);
ball = new BallState();
game = new GameState(playerLeft, playerRight, ball);
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