var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var bodyParser = require('body-parser');
var exec = require('child_process').exec

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));

app.get('/pos', function(req, res){
  var x = req.param("x");

  console.log(x);
    io.emit('x', x);
    res.send('<p>200 OK</p>');
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/normal.html');
})

app.get('/hard', function(req, res){
  res.sendFile(__dirname + '/hard.html');
})

io.on('connection', function(socket){
  console.log('a user connected');
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
  socket.on('chat message', function(msg){
    // console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
})