var express = require('express');
var cluster = require('cluster');  
var sleep = require('system-sleep');

if(cluster.isMaster) {

    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

} else {

    var app = express();

    app.get('/kill', function(req, res) {
        res.send('process ' + process.pid + ' was killed!').end();
        process.exit();
    });

    app.all('/*', function(req, res) {

        // Simulate route processing delay
        sleep(500);

        res.send('process ' + process.pid + ' says hello!').end();

    });

    app.listen(8000, function() {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}