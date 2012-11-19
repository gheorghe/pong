var http = require('http');

// Static file server
var inertia = require('inertia');
var staticServer = inertia.createHandler();
staticServer.addDirHandler('.');
var fileServer = http.createServer(function(req, res) {
    if (staticServer.serve(req, res)) return;
});
fileServer.listen(8000);

// Pongserver shizzz
var s = http.createServer(function(req, res) {
    res.writeHead(200, { 'content-type': 'text/plain'});
    res.write("hi...\n");
    setTimeout(function() {
        res.end("world\n");
    }, 1000);
});

s.listen(8080);