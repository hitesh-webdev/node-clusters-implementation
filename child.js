var longComputation = function(){
    var sum = 0, i;
    for(i = 0; i < 1e10; i++) {
        sum += i;
    }
    return sum;
}

process.on('message', function(msg){
    var sum = longComputation();
    process.send({
        sum: sum,
        id: process.pid
    });
    process.exit();
});