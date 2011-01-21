// 'http://127.0.0.1:3002/socket.io/socket.io.js'

var socket = new io.Socket('localhost', {port: 3002});
socket.connect(); 

socket.on('connect', function() {
  console.log('Client has connected to the server!');
  socket.send('hi!');
});
socket.on('message', function(msg) {
  console.log('Received a message from the server!', msg);
});
socket.on('disconnect', function() {
  console.log('The client has disconnected!');
});
