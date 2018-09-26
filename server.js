var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {

  var team = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue';
  if(team == 'blue'){
     var ordenada = 400;
     var direction = 1;
      //Math.floor(Math.random() * 700) + 50;
      }
  if(team == 'red'){
    var ordenada = 900;
    var direction = -1; 
   }
  
  // create a new player and add it to our players object
  players[socket.id] = {
    tRotation: 0,
    rotation: direction,
    x: ordenada, 
    y: Math.floor(Math.random() * 500) + 50,
    tx:0,
    ty:0,
    playerId: socket.id,
    team: team,
    bullet: {
      j:0,
      k:0,
      bRotation:0
    }
  };
  console.log('a user connected: ', socket.id, players);
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
  


  //when a player shoots
  socket.on('playerShoots', function (shootData) {
    players[socket.id].bullet.j = shootData.j;
    players[socket.id].bullet.k = shootData.k;
    players[socket.id].bullet.l = shootData.bRotation;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerShooted', players[socket.id].bullet);
  });
  /*socket.on('bulletMovement', function (movementData) {
    players[socket.id].bullet.j = movementData.j;
    players[socket.id].bullet.k = movementData.k;
    players[socket.id].bullet.l = movementData.bRotation;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('bulletMoved', players[socket.id].bullet);
  });*/

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    players[socket.id].tRotation = movementData.tRotation;
    players[socket.id].tx = movementData.tx;
    players[socket.id].ty = movementData.ty;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
});
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

