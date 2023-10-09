const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var RPS = "", thrower = "", winner = ""; 

// Serve the html file 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');  
  
  socket.on('disconnect', () => {    
    io.emit('chat message', "A user disconnected")
    console.log('A user disconnected');  
  });
  
  socket.on('name', msg => { 
    io.emit('chat message', msg + " connected on " + new Date().toLocaleTimeString());
    io.emit('chat message', "Play Rock, Paper, Scissors with other users using the commands /r, /p, and /s");
  });
  
  socket.on('chat message', (msg,sender) => { 
    // rock-paper-scissors logic 
    if(msg == "/r" || msg == "/p" || msg =="/s")
      {
        if(RPS == ""){
          io.emit('chat message', sender + " wants to play rock-paper-scissors");
          RPS = msg;
          thrower = sender;
        } 
        else if(RPS == msg)
        {
          io.emit('chat message', thrower + " and " + sender + " tied");
          RPS = "";
        }
        else if((RPS == "/r" && msg == "/s") || (RPS == "/s" && msg == "/r")){
          if(msg == "/s")winner = thrower;
          else winner = sender;
          io.emit('chat message', "Rock beats scissors! " + winner + " wins!");
          RPS = "";winner = "";thrower = "";
        }
        else if((RPS == "/p" && msg == "/s") || (RPS == "/s" && msg == "/p")){
          if(msg == "/p")winner = thrower;
          else winner = sender;
          io.emit('chat message', "Scissors beats Paper! " + winner + " wins!");
          RPS = "";winner = "";thrower = "";
        }
        else if((RPS == "/r" && msg == "/p") || (RPS == "/p" && msg == "/r")){
          if(msg == "/r")winner = thrower;
          else winner = sender;
          io.emit('chat message', "Paper beats Rock! " + winner + " wins!");
          RPS = "";winner = "";thrower = "";
        }
      }
    
    else socket.broadcast.emit('chat message', sender + ": " + msg + " " + new Date().toLocaleTimeString());
    // console.log(sender + ": " + msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

