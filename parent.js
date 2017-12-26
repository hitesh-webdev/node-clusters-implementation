var express = require('express');
var { fork } = require('child_process');

var app = express();

app.get('/', function(req, res){
    res.send('Hello!<br>Handled by Process ' + process.pid).end();
});

app.get('/compute', function(req, res){
    var compute = fork('child.js');
    compute.send('start');
    compute.on('message', function(data){
        res.send('Sum is ' + data.sum + '<br>Handled by Process ' + data.id).end();
    });
});

app.listen(8000, function(){
    console.log('Server is up on port 8000');
});