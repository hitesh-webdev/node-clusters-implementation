var express = require('express');

var app = express();

var longComputation = function(){
    var sum = 0, i;
    for(i = 0; i < 1e10; i++) {
        sum += i;
    }
    return sum;
}

app.get('/', function(req, res){
    res.send('Hello!<br>Handled by Process ' + process.pid).end();
});

app.get('/compute', function(req, res){
    var sum = longComputation();
    res.send('Sum is ' + sum + '<br>Handled by Process ' + process.pid).end();
});

app.listen(8000, function(){
    console.log('Server is up on port 8000');
});