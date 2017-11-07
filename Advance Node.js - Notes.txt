/* Advance Node.js
=========================================================== */

// Node's Popularity

1. Full Stack JavaScript
2. Non-blocking Event-driven
3. Single Thread environment

// Node's Architecture: V8 and Libuv

Node's default VM is V8. Node is on the path of being VM agnostic(dependency on anyone type of VM).
One other strong option for VM is the 'Chakra' engine by Microsoft(used in Microsoft Edge web browser).

So, the JavaScript features available in Node, are actually the JavaScript features supported by the V8 engine
shipped with Node.

$ node
> v8.getHeapStatistics()        // To get the statistics about total heap size and available size

It is more than a wrapper to V8. It provides API for working with Operating System, Files, Binary data, 
Networking etc. 

Node uses V8 via V8's C++ API. The Node API eventually executes the C++ code using V8 Object and Function 
templates. 

Node also handles waiting for asynchronous events for us using Libuv. It is used to abstract the non-blocking 
IO operations to a consistent interface across many operating systems. It handles operations on the file system,
TCP/UDP sockets and child processes. It includes a Thread Pool to handle what can't be done asynchronously 
at the operating system level. It provides the Event Loop.

When Node is done waiting for the IO operations it has callbacks to invoke.

No matter how many callbacks have been registered, Node will wait for the V8 can handle more operations. This makes 
programming in Node easy, we don't have to worry about 'locking' or 'race conditions'. 

// Global Object

The one and only true global object in Node is called 'global'. 

Two of the most important things that are available on the global object are the 'process' and 'buffer' object.

The Node's process object provides a bridge between a Node application and its running environment.

$ node -p "process.versions"        // To print versions of the current node and its dependencies

if(process.versions.v8 < '4') {
    // do something for old V8's
}

The 'env' property on the process object exposes a copy of the user environment(which a list of string we get using 
the SET command on windows cmd).

process.env.USER = 'hitesh'        // will not modify the actual environment variables ENV.USER

$ node -p "process.release.lts"         // Long Term Support label of the installed Node release
> Boron

The 'process' object is an instance of event emitter.

process.on('exit', (code) => {
    // only perform one final synchronous operation (can't use the event loop here)
});


// Buffer object
Buffer is used with binary streams of data. A buffer is a chunk of memory, allocated outside of the V8 heap, 
We can put some data in that memory which can be interpreted in many ways depending on the length of a 
character. So when there is a buffer, there is a character encoding.

To read data from the buffer, we need to specify the encoding. When we read content from files or encoding 
and we do not specify an encoding, we get back a Buffer object.

A buffer is a lower level data structure to represent the sequence of binary data. Unlike arrays once a buffer 
is allocated, it cannot be resized.

There are 3 ways to create buffer:

1. Buffer.alloc(8)          // create a filled buffer of certain size
<Buffer 00 00 00 00 00 00 00 00>

2. Buffer.allocUnsafe(8)       // this will not fill the created buffer, this will create an 8 byte buffer
<Buffer 04 02 00 00 00 00 00 00>

Note- This might contain old or sensitive data, and need to be filled right away.

Buffer.allocUnsafe(8).fill()

Note- To fill a buffer we can do Buffer.fill();

3. Buffer.from() - 

const string = 'hello';
const buffer = Buffer.from('hello');

console.log(string, string.length);             // hello 5
console.log(buffer, buffer.length);             // <Buffer 68 65 6c 6c 6f> 5

Note- Buffer.length gives the total number of bytes used to store the given string into the buffer.

Buffer is used to read image file from a TCP stream, compressed file or any other form of binary data access.
Just like arrys and string, we can use operations like indexOf(), include() and slice().

Note- But the difference is that when we use slice() operation on the buffer, the sliced buffer shares the same memory 
with the original buffer. So when we change the sliced buffer, the original buffer will also get changed.

When converting streams of binary data, we should use the StringDecoder() as it handles multi-byte characters
much better(especially incomplete multi-byte characters). It preserves the incomplete encoded characters 
internally and tells it complete and then returns the result. The deafult toString() operation on the buffer
does not do that.

Note- So if you are receiving the utf-8 characters in chunks in a stream you should always use StringDecoder().



// Require and Modules

=> package.json

{
    "name": "demo",
    "main": "start.js"
}

Note- Include this file to load start.js instead of index.js. when the 'demo' directory is required.

Note- require() first try to find a js file, then a JSON file(and parses it atuomatically into JS Object) and
finally a .node file(and will interpret the file as a compiled add-on module). It can work with or without 
specifying the extension of the file.

Note- 'npm prune' command will delete all the folders/libraries from the /node_modules folder, which are not 
mentioned in 'package.json' file.


Note- The JavaScript standard in Node follows and err first argument approach. That is, err object is always 
passed as the first argument of the object, while the callback function reference will always be passed as the 
last argument of the function.


// Event Emitter

const EventEmitter = require('events');         // import

class Logger entends EventEmitter {}            // extend

const logger = new Logger()                     // init

logger.emit('event')                            // emit

logger.on('event', listenerFunc)                // addListener

Note- We can use the emit function to emit any named event. 


// IO

Communication between a process in the CPU and anything external to that CPU, eg- Memory, disk, Network and even 
another process.

Threaded programming can get very complex when threads starts accessing shared resources. Eg- Nginx is single 
threaded.

Node uses an event loop for slow IO operations.

A loop that picks the events from the event loop, and puts their callbacks on the call stack. It is also present
in the browser.

// Node 'net' Module

We can use the Node's 'net' module to work with sockets.

var server = require('net').createServer();

server.on('connection', (socket) => {

    socket.write();         // To write to the socket

    socket.on('data', (data) => {
        // Handle the data input to the current socket
    });

    socket.on('end', () => {
        console.log('Client Disconnected');
    });

});


// Node's 'dns' module

This can be used to translate network's name into addresses and vice versa.

var dns = require('dns');

dns.lookup('google.com', (err, address) => {
    console.log(address);
});

Note- It does not necessarily perform network communication, rather uses the underlying OS to resolve the dns.
It is the only method in the 'dns' module, otherwise all the other methods use the network communication.

var dns = require('dns');

dns.reverse('163.53.78.128', (err, address) => {
    console.log(address);
});


// UDP Datagram sockets

var dgram = require('dgram');
const PORT = 3333;
const HOST = '127.0.0.1';

=> Server
const server = dgram.createSocket('udp4');

server.on('listening', () => {
    console.log('UDP server listening');
});

server.on('message', (msg, rinfo) => {
    console.log(`${rinfo.address}:${rinfo.port} - ${msg}`);
});

server.bind(PORT, HOST);


=> Client

const client = dgram.createSocket('udp4');

client.send('Hello!', PORT, HOST, (err) => {
    if(err) throw err;

    console.log('UDP message sent');
    client.close();
});


// HTTP Module

Node will stream the response and keep the connection with the client alive, until end() method is called on the 
response object. This makes Node an ideal platform for streaming video data.

Note- Terminating the response object with a call to the end() mehtod is not optional, we have to do it for every
request. If we don't the request will timeout after the default timeout period of 2 mins.

Note- We can the change the server's default timeout time by setting:

server.timeout = 5000;      // The new timeout time for the server will be 5 seconds now.


HTTPS is the HTTP protocol over TLS SSL.

const server = require('https').createServer({
    key:            // private key
    cert:           // certificate
});


Node can also be used as a client to request HTTP/HTTPS data.

const http = require('http');

const req = http.request(
    { hostname: 'www.google.com' },
    (res) => {
        console.log(res.statusCode);
        console.log(res.headers);

        res.on('data', (data) => {
            console.log(data.toString());
        });
    }
);

req.on('error', (err) => {
    console.log(err);
});

req.end();


=> Routes in Node

const server = require('http').createServer();

server.on('request', (req, res) => {
    switch(req.url) {
        case '/home':
        case '/about': 
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(`.${req.url}.html`));
            break;
        case '/':
            res.writeHead(301, { 'Location': '/home' });        // Permanent Move => Redirecting to Home page
            res.end();
            break;
        default: 
            res.writeHead(404);
            res.end();
    }
});


=> Prsing URLs in Node

url.parse('<URL>');

url.parse('<URL>', true);           // This will parse the query string itself

If we want to create a URL from the given object we can use:

url.format({
    protocol: 'https',
    host: 'www.google.com',
    search: '?q=node.js',
    pathname: 'search'
});

// 'https://www.google.com/search?q=node.js'

querystring.stringify({
    name: 'hitesh aswani',
    age: 22
});

querystring.parse('name=hitesh%20aswani&age=22');


// Files Module in Node

=> Truncating the file data into half

fs.stat(filepath, (err, stats) => {
    if(err) throw err;

    fs.truncate(filepath, stats.size/2, (err) => {
        console.log(err);
    });
});


=> Deleting files older than 7 days

fs.utimes(filepath, access_time, modified_time, (err) => {          // UNIX timestamp in seconds
    if(err) throw err;
});

This method can be used to change the timestamp of a file.

stats.mtime.getTime()       // Will give the modified time of the file in miliseconds

fs.unlink(filepath, (err) => {      // Will delete the file at the given file path
    if(err) throw err;          
});


=> Watch a directory

fs.watch(dirname, (eventType, filename) => {
    if(eventType == 'rename') {     // add or delete
        // Checking current files array index
        return;
    }

    console.log(`File ${filename} content was changed`);
});


// Inspecting Node in the Chrome DevTools

$ node --inspect-brk index.js


// Working with streams

Working with big amount of data means working with streams. 

Streams are collections of data that minght not be available all at once and don't have to fit entirely in the
memory.

Now when our server serves a big file let's say a video file of over 1 GB, then to send it in the response to the 
client, the server will have to buffer the entire file in the memory using fs.readFile() and send the entire 
buffered file in the memory to the client in the response object.

This is very inefficient, as it will hugely use the server's memory resources and thus making the server unresponsive 
for other client requests.

server.on('request', (req, res) => {

    const src = fs.createReadStream('./big.file');
    src.pipe(res);

});

=> There are 4 fundamental stream types in Node.js

1. Readable (fs.createReadStream)
2. Writable (fs.createWriteStream)
3. Duplex (net.Socket)      // both readbale and writable
4. Transform (zlib.createGzip)     // duplex stream that can be used to modify/transform the data

We can consider a Transform stream as a function, where we can consider input as a writable stream part and output
as a readable stream part.

Note- All streams are instances of event emitter. All of them emit event that we can use to write and read data 
from them.

However, we can consume streams in a simpler way using the pipe method. 

src.pipe(dst);

src - readable stream
dst - writable stream 

They can both be duplex stream as well.

Note- The readable and writable sides of a Duplex stream works completely independent of each other.

=> Implementing streams - require('stream')

=> Consuming streams - pipe/stream events

=> Events on Readable streams:

1. data - whenever the stream passes a chunk of data to the consumer
2. end - when there is no more data to be consumed from the streaming

=> Events on Writable stream:

1. drain - the writable stream can receive more data
2. finish - when all the data has been flushed to the underlying system

=> Modes of a Readable stream

1. Paused - we have to use .read() method to consume it 

2. Flowing - we have to use event handlers to consume it. In this mode data can be lost if no comsumers are there 
to handle the data. 

Note- Adding a 'data' event handler switches the paused stream into flowing mode. And removing the 'data' handler 
switches it back to paused mode.

Paused => stream.resume() => Flowing
Paused <= stream.pause() <= Flowing


// Scalability Strategies

1. Cloning - Clone the process multiple times and have each cloned instance handle part of the workload.

2. Decomposing - Having different applications with different code bases and Sometimes having their own databases 
and user interfaces. Microservices

3. Splitting - Split the application into multiple instances, where each instance is reponsible only a part of
application data. Horizontal partitioning or sharding.


// Node Child Processes 

The child process modules let's us execute any system(OS) command to execute in a child process. Listen to its 
output stream(stdout) and write to its input stream(stdin). We can control the arguments passed to the child process
setting them in 'env' option. We can also pipe the ouput of one process to the input of another process.

There are 4 methods using which we can create child process in Node.

1. Spawn - This method launches the command in the new process, we can use it to pass that command in the 
arguments.

const child = spawn('pwd');

Note- This command will create a new process which will execute the print working directory(pwd) command.
The result of this spawn function is the child process instance, which implements the Node.js event emitter API.
This means we can register handler for the events of this child process.

child.on('exit', function(code, signal){
    console.log(`Child process exited with code: ${code} and signal: ${signal}`);
});

Note- This signal object is null, when the child process exits normally, that is, exit code 0.

=> Other events on child processes

i. diconnect - When the parent process manully calls child's disconnect method.

ii. error - When the process could not be spwaned or killed.

iii. message - When the child process uses process.send() to send the message to the parent process. This is 
how the child and parent process communicate with each other.

iv. close - When the standard iostream of the child process gets closed down. 
(child.stdin, child.stderr, child.stdout)

Note- Multiple child processes may share the same standard IO streams. This is different from the exit event, 
as the child process exiting does not mean that the stream got closed.

Since all streams are event emitter, we can listen to different events on those streams attached to every child 
process.

child.stdout and child.stderr are readable streams and child.stdin is the writable stream. (which is the inverse of
those found in the normal process).

child.stdout.on('data', function(data){
    console.log(`child stdout: ${data}`);
});

Note- This will print the output of the command passed in the spawn() method. 

child.stdout.on('data', function(data){
    console.log(`child stderr: ${data}`);
});

const child = spawn('wc');      // counts charaters, words and lines

process.stdin.pipe(child.stdin);     // node spawn-pipe.js => hello


2. Exec - The spawn() method doesn’t create a shell to execute a command passed to it, makes it slightly more 
efficient than the exec() method which does creates the shell.
It also buffers the command's generated output and passes it as an argument to the callback function.

Exec is a good choice if we want to use the shell command and the data returned from the command is not big,
because it buffers the whole data before it returns it.

exec('find . -type f', (err, stdout, stderr) => {
    if(err) {
        console.log(`exec error: ${error}`);
        return;
    }
    console.log(`Number of files: ${stdout}`);
});

The spawn function is a much better choice when the data returned from the execution of the command is big,
as the output data is streamed with the standard io objects. 

We can also make the child process inherit the standard io objects of its parent.

const child = spawn('find', ['.', '-type', 'f'], {                  // find . -type f
    stdio: 'inherit'                // inheriting the stdin, stdout, stderr of the parent process
});

Note- This will make the script output the result right away without listening to the 'data' event on the 
stdout of the child process.

// Best of exec and spawn (that is to use shell instead of passing the arguments in the array)

spawn('find . -type f', {
    stdio: 'inherit',
    shell: true
});

We can also set the working directory of the command to be executed.

spawn('find . -type f', {
    stdio: 'inherit',
    shell: true,
    cwd: '/Users/hitesh/Desktop'
});

We can also specify the environment variable, which they have access to parent's process environment
variables by default. We can overwrite this behaviour by passing an empty 'env' object in the arguments.
We can also manually define the environment variables for the child process.

spawn('echo $ANSWER', {
    stdio: 'inherit',
    shell: true,
    env: { ANSWER: 44 }
});

The 'detached' option can be used to run the child process independently of the parent process. But the exact
behaviour depends on the operating system.
On Windows the detached child process will have its own console window.

Because of the stdio: 'inherit' option above, when we execute the code, the child process inherits the main 
process stdin, stdout, and stderr. This causes the child process data events handlers to be triggered on the 
main process.stdout stream, making the script output the result right away.

if the unref() mehtod is called on the detached child process, then the parent process can exit independently 
of the child. But to keep it running in the background the child's standard io config also have to be 
independent of the parent.

const child = spawn('echo ', {
    detached: true,
    stdio: 'ignore'
});

child.unref();

Note- This will run a node process in the background by detaching and also ignoring the parent's process 
standard IO configurations.


3. execFile() - If you need to execute a file but without using a shell. It behaves exactly like the exec 
function but doesn't uses the shell.
On windows .bat or .cmd files cannot be executed with this command.


4. Fork() - Its a variation on the spawn() function for spwaning Node processes. The biggest difference 
between spawn and fork is that a communication channel between parent and child process is established when 
using fork().

So we can use the send method on the forked process and the global process object to exchange messages Between
the parent and the child process.


// Node's Cluster Module

Node's cluster module is based on this idea of child process forking and load balancing the requests among the
many forks that we can create in our system.

It is based on the fork function and allows us to fork our main application process as many times as we have
CPU cores. 

Even if you are not worried about the load on your Node server, you should implement the Node's cluster module
anyway to increase your server availability and fault tolerance. 

The elegant solution Node.js provides for scaling up the applications is to split a single
process into multiple processes or workers, in Node.js terminology.

Remember that only one process can access a port at any given time. The naive solution here is to 
configure each process to listen on a different port and then set up Nginx/Apache to load balance 
requests between the ports.

Instead, you can fork the master process in to multiple child processes (typically having one child 
per processor). In this case, the children are allowed to share a port with the parent (thanks to 
inter-process communication, or IPC), so there is no need to worry about managing multiple ports.

A cluster is a pool of similar workers running under a parent Node process.

The master process is in charge of initiating workers and controlling them. 
You can create an arbitrary number of workers in your master process.

The master's only purpose here is to create all of the workers (the number of workers created is 
based on the number of CPUs available), and the workers are responsible for running separate instances 
of the Express server.

When a worker is forked off of the main process, it re-runs the code from the beginning of the module. 
When the worker gets to the if-statement, it returns false for cluster.isMaster, so instead it'll 
create the Express app, a route, and then listens on port 8000. In the case of a quad-core processor, 
we'd have four workers spawned, all listening on the same port for requests to come in.

Note- Cluster is jsut a wrapper for child_process.fork()
Master process acts like a load balancer.

// The Node.js Cluster Module

=> Spawning Workers

The primary Node.js process is called the master. Using the cluster module, the master can spawn additional 
worker processes and tell them which Node.js code to execute. This works much like the Unix fork() where a 
master process spawns child processes.

=> IPC Channel Between Master and Workers

Whenever a new worker is spawned, the cluster module sets up an IPC (Inter Process Communication) channel 
between the master and that worker processes. Thru this IPC mechanism, the master and worker can exchange 
brief messages and socket descriptors with each other.

=> Listening to Inbound Connections

Once spawned, the worker process is ready to service inbound connections an invokes a listen() call on 
a certain HTTP port.

Node.js internally rewires this call as follows:

• The worker sends a message to the master (via the IPC channel), asking the master to listen on the 
specified port.
• The master starts to listen on that port (if it is not already listening).
• The master is now aware that a specific worker has indicated interest in servicing inbound requests 
arriving on that port.

Node- While it may seem that the worker is invoking the listen(), the actual job of
listening to inbound requests is done by the master itself.

=> Load Balancing Between Worker Processes

When an inbound request arrives, the master accepts the inbound socket, and adopts a round-robin mechanism 
to decide ‘which worker’ should this request be delegated to. The master then hands-over the socket descriptor 
of this request to that worker over the IPC channel. This round-robin mechanism is part of the Node core and 
helps accomplish the load balancing of the inbound traffic between multiple workers.


/* Recommended Practices
============================================================== */

=> Minimize Responsibilities of The Master

The master process should only be responsible for: 
• Spawning worker processes at the start of your server.
• Managing the lifecycle of your worker processes.
• Delegating all inbound requests to workers.

In particular, do not encapsulate your business logic in the master process.
And do not load any unwanted npm modules in the master.

Most runtime errors are likely to occur due to buggy business code or npm modules used by your code. 
By encapsulating business code only in the workers, such errors will impact (or crash) a worker
processes, but not impact your master process.
This gives you a stable, unhindered, master process which can watch over the worker processes all the time.

If the master itself crashes or is badly-behaved (because it ran buggy business code), there is no caretaker 
left for your workers anymore.

=>  Replenishing Worker Processes

It is possible that worker processes die over time. This can happen due to various reasons:
Why Worker Processes Die?
A worker process could run out of memory and die.
Bug introduced by programmer causes an abrupt worker crash.

When a worker dies, Node.js notifies your master process with an 'exit' event. At that point, in the event 
handler, your master process should spawn a new worker process. This ensures that we have enough workers in 
our pool to service inbound traffic.

=> Periodic Roll-Over of the Cluster

some npm modules could potentially result in slow memory leaks. Sometimes your own own code could leak
memory as well.

To keep the cluster healthy, it is recommended that your master periodically kill all worker processes and 
spawn new ones. But this needs to be done elegantly - If you kill all workers at once, there would be nobody 
left to do the work and the server’s throughput would drop momentarily.

1. The master chooses one worker from the present pool of workers in the cluster and decides to gracefuly kill 
that worker.

2. At the same time, the master spawns a new worker process to replenish capacity.

3. Once the rollover of this worker is completed, the master picks the next worker from the initial pool to 
gracefully roll that one, and the process continues until all workers are ‘roled over’.

Note- Roling workers is a great way to keep your node cluster healthy over elongated periods of time.

=> Zero Downtime Restarts

The aim for a mature DevOps is to have a zero downtime restart capability on the production servers in the 
process of hot redeployment of the new code. This means:

• The development team can push new code snapshots to a live server without shutting down the server itself 
(even for a moment).
• All in-flight and ongoing requests continue to be processed normally without clients noticing any errors.
• The new code cuts-over seamlessly and soon new client requests get served by the newly deployed code.

1. Suppose you have a running Node.js cluster that is serving Version 1 of your code.

2. Now you place Version 2 of your code on the file system. And you send a signal to the master to initiate 
a graceful rollover of the entire cluster.

3. At this point, the master will gracefully kill one worker at a time, and span a new worker as a replenishment. 
This new worker will read Version 2 of your code and start serving requests suing the Version 2 code.
 
4. As an additional safeguard, if the new worker dies within a short threshold of time, the master infers 
that the new code may have a buggy mainline and hence it does not proceed with the graceful restart for 
other workers.


// But how are requests divided up between the workers?
To handle this, there is actually an embedded load-balancer within the cluster module that handles 
distributing requests between the different workers.
On Linux and OSX (but not Windows) the round-robin policy is in effect by default.
The only other scheduling option available is to leave it up to the operating system, which is 
default on Windows.

The scheduling policy can be set either in cluster.schedulingPolicy(cluster.SCHED_RR for round-robin 
or cluster.SCHED_NONE to leave it to the operating system) or by setting it on the 
environment variable NODE_CLUSTER_SCHED_POLICY (with values of either 'rr' or 'none').


Although this is one of the easiest ways to multi-thread, it should be used with caution. 
Just because you're able to spawn 1,000 workers doesn't mean you should. Each worker takes up 
system resources, so only spawn those that are really needed.

The reason why the number of forks equals the number of CPU cores, is because that is the 
optimal number. Increasing it past that, can decrease performance, reason being is that since 
if your processor has N number of cores, it can only process N number of processes at the same time.

For example: if you have 4 cores, and you have 10 processes where each process will have at 
minimum 1 thread, only 4 of these threads can ever be executed by your CPU concurrently. The 
rest of the threads will be waiting for their turn to be executed by the processor. Your OS will 
then intermittently perform a context switch , whereby it will pause a running thread, and switch 
to a thread that is waiting, and execute that thread instead. This "switching" process results in 
additional processing overhead. Therefore, for the most efficient use of your CPU cycles, you want 
the number of your forks (processes) to match the number of your cores in order to minimize context 
switches.


Two common events related to the moments of start and termination of workers are the 
online and the exit events.
online is emitted when the worker is forked and sends the online message. 
exit is emitted when a worker process dies.

// How to Develop a Highly Scalable Express Server

var cluster = require('cluster');

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
    var app = require('express')();
    app.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})

    var server = app.listen(8000, function() {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}

=> Additions

1. The os module contains a cpus() function, which returns an array of CPU cores. 
Using this approach, we determine the number of the workers to fork dynamically, based on the 
server specifications to maximize the utilization.

2. A second and more important addition is handling a worker’s death. When a worker dies, 
the cluster module emits an exit event. It can be handled by listening for the event and executing 
a callback function when it’s emitted. You can do that by writing a statement like 
cluster.on('exit', callback);. In the callback, we fork a new worker in order to maintain the 
intended number of workers. This allows us to keep the application running, even if there are 
some unhandled exceptions.


// Communication Between Master and Workers

Occasionally you may need to send messages from the master to a worker to assign a task or perform 
other operations. In return, workers may need to inform the master that the task is completed. 

To listen for messages, an event listener for the message event should be set up in both master and workers:

worker.on('message', function(message) {
    console.log(message);
});

Note- The worker object is the reference returned by the fork() method. 

To listen for messages from the master in a worker:

process.on('message', function(message) {
    console.log(message);
});


Messages can be strings or JSON objects. To send a message from the master to a specific worker, 
you can write a code like the on reported below:

worker.send('hello from the master');

Similarly, to send a message from a worker to the master you can write:

process.send('hello from worker with id: ' + process.pid);

In Node.js, messages are generic and do not have a specific type. Therefore, it is a good practice to 
send messages as JSON objects with some information about the message type, sender, and the content itself. 
For example:

worker.send({
    type: 'task 1',
    from: 'master',
    data: {
        // the data that you want to transfer
    }
});


// Siege benchmark 

"ECONNRESET" means the other side of the TCP conversation abruptly closed its end of the connection.
What could also be the case: at random times, the other side is overloaded and simply kills the 
connection as a result.

=> Requests per second
This roughly approximates a typical request handler that perhaps does some logging, 
interacts with the database, renders a template, and streams out the result.


=> Making a responsive server during overloaded connection requests

Preemptive limiting adds robustness: Under load that exceeds capacity by an order of magnitude the 
application continues to behave reasonably.

Success and Failure is fast: Average response time stays for the most part under 10 seconds.

These failures don’t suck: With preemptive limiting we effectively convert slow clumsy failures 
(TCP timeouts), into fast deliberate failures (immediate 503 responses).

var toobusy = require('toobusy');

// The absolute first piece of middle-ware we would register, to block requests
// before we spend any time on them.
app.use(function(req, res, next) {
  // check if we're toobusy() - note, this call is extremely fast, and returns
  // state that is cached at a fixed interval
  if (toobusy()) res.send(503, "I'm busy right now, sorry.");
  else next();
});

Looking at processor usage for the current process, usage above 90% is “too busy”. This approach 
fails when you have multiple processes on the machine that are consuming resources and there is 
not a full single processor available for your node application.

node.js process is too busy when it is unable to serve requests in a timely fashion – a 
criteria that is meaningful regardless of the details of other processes running on the server.

The approach taken by node-toobusy is to measure event loop lag. 

=> Sticky Load Balancing

If you need sticky load balancing (where the the same client should be sent to the same worker 
for every request), you can use LoadBalancer.js

Sticky load balancing has come into play in e-commerce situations where things like shopping carts 
are heavily dependent upon maintaining a given TLS session. For example, in our environment we have 
dozens of e-commerce servers behind a load balancer. If a user was interacting with Server A and then 
suddenly be directed to Server B the next time it hit the load balancer, it would break the way our 
e-comm folks have the shopping cart setup.

I have recommended setting up a load balanced TLS session cache cluster so any server could pick up 
for any other server’s TLS session as needed, eliminating the need for sticky load balancing.

Once a client establishes its first successful connection/request with a target, all subsequent 
connections/requests from that client will stick to that same target unless that target crashes or 
goes offline (or the session times out).

It chooses the appropriate target based on a hash of the client's IP address.

To run LoadBalancer.js, you just need to provide it with a config file:

{
  "sourcePort": 80,
  "targetDeactivationDuration": 60000,
  "stickiness": true,
  "targets": [
    {
      "host": "localhost",
      "port": 8000
    },
    {
      "host": "localhost",
      "port": 8001
    }
  ]
}

Note- LoadBalancer.js does balancing at the TCP layer.


/* Incoming Request Queueing
========================================================= */

I have a specific/strange requirement where I need to do something like this:

app.put('/example/:entity', function(req, res, next) {
     fs.writeFileSync(someFile);
});
Since its a sync operation, it will block the event loop and I am concerned that node.js/express will start 
dropping http requests.

For a short term solution:

Is there any queue/limit of incoming requests in node.js/express?
Is there any configuration that I can use to increase the queue size?
Would node.js/express bounce requests if the event loop is blocked?


=> Solution

Your service will still accept incoming connections while you have node's event loop blocked up but express won't 
be able to respond to anything. Incoming requests will get queued as part of the underlying TCP implementation.

Is there any queue/limit of incoming requests in node.js/express?
There's probably a virtual limit in terms of memory being used to queue incoming requests, but this is a detail 
of your underlying TCP stack, not node.js.

Is there any configuration that I can use to increase the queue size?
I think you can decerase the TCP connection cap in OS settings to prevent your server from getting easily 
overloaded. Increasing it is the wrong solution to your problem I think (see below).

Would node.js/express bounce requests if the event loop is blocked?
No, since its I/O under the hood, node.js/express are not bouncing the incoming requets you get while the event 
loop is blocked. Your requests won't get bounced until you hit some configured TCP connection limit. But you 
really don't want it to ever get this blocked up.

To be frank, blocking the event loop in node.js is almost always a bad idea. and there's always a way around 
it. In your case, if you need to write that file in series, try pushing events onto a backend queue that you 
can configure to handle one event at a time without blocking up the works. kue + redis is a good option for 
this.