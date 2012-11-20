$(document).ready(function() {
    var canvas = $("#canvas");
    var ctx = canvas.get(0).getContext("2d");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();
    
    // Put the motherfucker to sleep for good
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    
    Function.prototype.delay = function(del) {
        var _this = this;
        (function() {
        setTimeout(_this,del);
        })();
    }
    
    var running = true;
    
    // Screens
    var menuScreen = $("#menu");
    var gameScreen = $("#game");
    var winDialog = $("#win");
    var loseDialog = $("#lose");
    var pointDialog = $("#point");
    
    var playAgain = $("#playAgain");
    
    // Initial screen setup
    winDialog.hide();
    loseDialog.hide();
    pointDialog.hide();
    
    var startGame = $("#start");
    var togglePause = $("#togglePause");
    var leftScore = $("#leftScore");
    var rightScore = $("#rightScore");
    var speedIndicator = $("#speedIndicator");
    
    var debug = $("#debug");
    
    var game = new Game();
    
    startGame.click(function() {
        menuScreen.hide();
        animate();
        game.initializeGame();
    });
    
    playAgain.click(function() {
        winDialog.hide();
        loseDialog.hide();
        game.initializeGame();
    });
    
    var animate = function() {
        if (running) {
            // Clear
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = "black";
            ctx.strokeRect(2, 2, canvasWidth-2, canvasHeight-2);
            
            // Draw
            for (var i =0; i < game.paddles.length; i++) {
                game.paddles[i].drawPaddle();
            };
            game.ball.drawBall();
            
            // Move
            game.ball.moveBall();
        };
        
        // Repeat
        setTimeout(animate, 20);
    };
    

    // Update paddles location when mouse moves
    $("#canvas").mousemove(function(e) {
        for (var i =0; i < game.paddles.length; i++) {
            game.paddles[i].ypos = e.pageY;
            game.paddles[i].movePaddle();
        };
    });
    
    function Game() {
        // Game properties
        this.started = false;
        this.startSpeed = 4;
        speedIndicator.html(this.startSpeed);
        this.border = 4;
        this.winscore = 3;

        this.ball = new Ball(this);
        this.paddles = [];
        this.paddles.push(new Paddle(this, canvasHeight/2, "left"));
        this.paddles.push(new Paddle(this, canvasHeight/2, "right"));
        
        this.initializeGame = function() {
            this.rightScore = 0;
            this.leftScore = 0;
            leftScore.html(this.leftScore);
            rightScore.html(this.rightScore);
            
            this.startRound();
        };

        this.startRound = function() {
            pointDialog.hide();
            speedIndicator.html(this.startSpeed);
            this.ball.toCenter();
            
            // Send ball in a random direction
            var side = Math.random() > 0.5 ? -1 : 1;
            var upordown = Math.random() > 0.5 ? -1 : 1;
            this.ball.velocityX = (Math.random() * 2 + this.startSpeed) * side;
            this.ball.velocityY = (Math.random() * 2 + this.startSpeed) * upordown;
            this.started = true;
        };
        
        this.pointCelebration = function() {
            pointDialog.show()
            this.ball.stopMoving();
            pointDialog.show();
            running = false;
            setTimeout(function() { running = true }, 2500);
            this.startRound();
        };
        
        this.incrementScore = function(player) {
            if (player == "left") {
                this.leftScore++;
                leftScore.html(this.leftScore);
                this.pointCelebration();
            } else {
                this.rightScore++;
                rightScore.html(this.rightScore);
                this.pointCelebration();
            };
            if (this.leftScore >= this.winscore) {
                this.playerWin("left");
            } else if (this.rightScore >= this.winscore) {
                this.playerWin("right");
            };
        };
        
        this.playerWin = function(player) {
            winDialog.show();
            this.ball.stopMoving();
            this.ball.visible = false;
        };
    }
    
    function Ball(game) {
        this.game = game;
        // Properties
        this.ballSize = 5;
        this.speedIncFactor = 0.1;
        this.visible = true;
        
        // Linear velocity
        this.velocityX = 0;
        this.velocityY = 0;
        
        this.getSpeed = function() {
            var absoluteSpeed = Math.abs(this.velocityX) + Math.abs(this.velocityY)
            return Math.round(absoluteSpeed / 2);
        };
        
        this.toCenter = function() {
            this.visible = true;
            this.velocityX = 0;
            this.velocityY = 0;
            this.y = canvasHeight / 2;
            this.x = canvasWidth / 2;
        };
        this.toCenter();
        
        this.stopMoving = function() {
            this.velocityX = 0;
            this.velocityY = 0;
        };
        
        // Calculate how far from the center the ball hit the paddle
        // values are -1 for top, 1 for bottom, 0 for middle
        this.deviationFactor = function(paddle) {
            var maxDistance = paddle.paddleSize / 2
            var distanceFromCenter = (this.y - paddle.y) - maxDistance;
            return distanceFromCenter / maxDistance;
        };
        
        this.applyDeviation = function(deviationFactor) {
            if (this.velocityY > 0) {
                if (Math.abs(deviationFactor) > 0.8) {
                    this.velocityY *= deviationFactor;
                }
            } else {
                if (Math.abs(deviationFactor) > 0.8) {
                    this.velocityY *= -deviationFactor;
                }
            }
        };

        this.bounceBall = function() {
            // Bounce off walls
            if (this.x - this.ballSize < this.game.border) {
                this.x = this.ballSize + this.game.border + 1;
                this.velocityX *= -1;
            } else if (this.x + this.ballSize > canvasWidth + this.game.border) {
                this.x = canvasWidth - this.ballSize - this.game.border - 1;
                this.velocityX *= -1;
            };
            if (this.y - this.ballSize < this.game.border) {
                this.y = this.ballSize + this.game.border + 1;
                this.velocityY *= -1;
            } else if (this.y + this.ballSize > canvasHeight + this.game.border) {
                this.y = canvasHeight - this.ballSize - this.game.border - 1;
                this.velocityY *= -1;
            };
                        
            // Bounce off paddles
            for (var i = 0; i < this.game.paddles.length; i++) {
                if (this.game.paddles[i].side == "right") {
                    var paddleEdge = this.game.paddles[i].x - this.ballSize;
                    var isInsidePaddle = this.game.paddles[i].y <= this.y && this.y <= (this.game.paddles[i].y + this.game.paddles[i].paddleSize);
                    if (this.x >= paddleEdge && isInsidePaddle) {
                        this.x = this.game.paddles[i].x - this.game.paddles[i].paddleThickness - this.ballSize + 1;
                        this.velocityX *= -1;
                        // Apply deviation
                        this.applyDeviation(this.deviationFactor(this.game.paddles[i]));
                        this.incrementSpeed();
                        debug.html(this.deviationFactor(this.game.paddles[i]));
                    };
                } else if (this.game.paddles[i].side == "left") {
                    var paddleEdge = this.game.paddles[i].x + this.game.paddles[i].paddleThickness + this.ballSize;
                    var isInsidePaddle = this.game.paddles[i].y <= this.y && this.y <= (this.game.paddles[i].y + this.game.paddles[i].paddleSize);
                    if (this.x <= paddleEdge && isInsidePaddle) {
                        this.x = this.game.paddles[i].x + this.game.paddles[i].paddleThickness + this.ballSize + 1;
                        this.velocityX *= -1;
                        // Apply deviation
                        this.applyDeviation(this.deviationFactor(this.game.paddles[i]));
                        this.incrementSpeed();
                        debug.html(this.deviationFactor(this.game.paddles[i]));
                    };
                };
            };
        };
        
        this.detectScore = function() {
            if (this.x <= 1 + this.game.border + this.ballSize) {
                this.game.incrementScore("right");
            } else if (this.x >= canvasWidth - this.game.border - this.ballSize) {
                this.game.incrementScore("left");
            };
        };
        
        this.incrementSpeed = function() {            
            this.velocityX += this.velocityX > 0 ? this.speedIncFactor : -this.speedIncFactor;
            this.velocityY += this.velocityY > 0 ? this.speedIncFactor : -this.speedIncFactor;
            
            // Speed limit, things get messed up at higher speeds
            if (this.velocityX >= 15) { this.velocityX = 15 };
            if (this.velocityY >= 15) { this.velocityY = 15 };
            
            speedIndicator.html(this.getSpeed());
        };
        
        this.moveBall = function() {
            this.bounceBall();
            this.detectScore();
            
            // Move it
            this.x += this.velocityX;
            this.y += this.velocityY;
        };
        
        this.drawBall = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.ballSize, 0, 2*Math.PI, false);
            ctx.lineWidth = 2;
            if (this.visible) {
                ctx.strokeStyle = "black";
            } else {
                ctx.strokeStyle = "white";
            };
            ctx.stroke();
        };
    }
    
    function Paddle(game, ypos, side) {
        // Params
        this.ypos = ypos;
        this.side = side;
        this.game = game;
        
        // Properties
        this.paddleSize = 50;
        this.paddleThickness = 5;
        this.paddleSpacing = 10;
        
        // Coordinates
        this.x = 0;
        this.y = 0;
        this.w = this.paddleThickness;
        this.h = this.paddleSize;
        this.maxy = canvasHeight - this.game.border - this.paddleSpacing - this.paddleSize/2;
        this.miny = this.game.border + this.paddleSpacing + this.paddleSize/2;
        
        this.movePaddle = function () {
            // Never let the paddle go off screen
            if (this.ypos > this.maxy) {
                this.ypos = this.maxy;
            };
            if (this.ypos < this.miny) {
                this.ypos = this.miny;
            };
            
            if (this.side == "right") {
                this.x = canvasWidth - (this.game.border + this.paddleSpacing);
            } else if (this.side == "left") {
                this.x = this.game.border + this.paddleSpacing;
            };
            this.y = this.ypos - this.paddleSize/2;
        };
        this.movePaddle();  // Run to set initial position
        
        this.drawPaddle = function () {
            ctx.fillRect(this.x, this.y, this.w, this.h);
        };
    }
});