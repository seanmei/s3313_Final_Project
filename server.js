const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io')
const formatMessage = require('./utilities/messages');
const {userJoin, getCurrentUser, removeCurrentUser, getRoomUsers } = require('./utilities/users');
 
const app = express();
const server = http.createServer(app); //create server 
const io = socket(server);

//access static folder 
app.use(express.static(path.join(__dirname, 'static')));

const admin = "Cortana";

//checks for client connection 
io.on('connection', socket => {
    console.log('New Connection');

    //get user name and room 
    socket.on('joinRoom', ({username, room}) => {
        socket.emit('message', formatMessage(admin , "Welcome"));//send response to client after connection 
        console.log(username);
        const user = userJoin(socket.id , username, room);
        console.log("DF")
       

        socket.join(user.room);//rooms or chats in our case which is socket.io function 



         //Broadcast to all clients except the current client 
         //Broadcast to a specific room
        socket.broadcast.to(user.room).emit('message', formatMessage(admin,  `${user.username} joined the chat `));


        //update room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)

        })


        //check for user disconnect 
        socket.on('disconnect', () => {
            removeCurrentUser(socket.id);
            const user = getCurrentUser(socket.id);
            if(user){
                    //tell all clients 
                io.to(user.room).emit('message', formatMessage(admin,  ` ${user.username} has left the chat`));
                    //update room info 
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)

                });
            }    
        });

    });

    //catch message 
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        console.log(user);
        io.to(user.room).emit('message',formatMessage(user.username, msg)); //send the message back to all clients 
    });

});

const PORT = 3000 || process.env.PORT;

//checks if server running 
server.listen(PORT,  () => console.log(`Server running on port ${PORT}`));
