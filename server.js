const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};
let userCount = 0;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });


io.on('connection', (socket) => {
  userCount++;
  users[socket.client.id] = {};
  users[socket.client.id].socket = socket;
  users[socket.client.id].name = socket.client.id;
  users[socket.client.id].nickname = 'User ' + userCount;
  users[socket.client.id].cursorCol = '#' + Math.floor(Math.random()*16777215).toString(16);
  console.log('a user connected: ' + socket.client.id);
  io.emit('chat message', socket.client.id + ' connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', socket.client.id + ' left');
    delete users[socket.client.id];
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', socket.client.id + ':' + msg);
  });
  socket.on('c-updatecursor', (msg) => {
    users[socket.client.id].cursorPos = msg.pos;

    const cursors = []
    for (const u in users) {
      cursors.push({user: users[u].name, 
                    cursorPos: users[u].cursorPos,
                    cursorCol: users[u].cursorCol,
                    cursorName: users[u].nickname,
                  });
    }
    //console.log('transmitting ', cursors)
    io.emit('s-updatecursors',cursors);
  
  });
});


function tick() {
  //todo:
  setTimeout(tick,500);
}

function pingpong() {
  io.emit('ping','ping');
  setTimeout(pingpong,5000);
}
  

const PORT = 80;
server.listen(PORT, () => {
  console.log('listening on *:'+PORT);
});

tick();
pingpong();