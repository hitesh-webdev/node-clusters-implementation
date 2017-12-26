var express = require('express');  
var sleep = require('system-sleep');

var app = express();

app.get('/*', function(req, res){

    // Simulate route processing delay
    sleep(500);

    res.send('Process ' + process.pid + ' says Hello!').end();

});

app.listen(3000, function(){
    console.log('Process ' + process.pid + ' is listening to all the incoming requests');
});

