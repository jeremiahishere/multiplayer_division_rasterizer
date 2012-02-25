var express = require('express');
var socketio = require("socket.io");

var app = express.createServer(express.logger(), express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.listen(8000);

var io = socketio.listen(app);

var events = new Array();
io.sockets.on('connection', function(socket) {
  socket.emit('init_data', { 
    my_id: socket.id, 
    past_events: events
  });

  socket.on('mouse_move', function(data) {
    current_event = {
      user_id: data.my_id,
      point: data.my_point
    }
    events.push(current_event);
    if(events.length > 1500)  {
      events = []
      io.sockets.emit('refresh', {});
    } else {
      io.sockets.emit('mouse_move_broadcast', current_event);
    }
  });

  socket.on('disconnect', function(){
    // handle disconnections, remove users, etc
  });
});
