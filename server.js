const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io')
const formatMessage = require('./utilities/messages');
const fs = require('fs');
const {userJoin, getCurrentUser, removeCurrentUser, getRoomUsers} = require('./utilities/users');
 
const app = express();
const server = http.createServer(app); //create server 
const io = socket(server);

//access static folder 
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) =>{
    res.send('hello')
})

const admin = "Professor Grolinger Bot";

//checks for client connection 
io.on('connection', socket => {
    console.log('New Connection');

    //get user name and room 
    socket.on('joinRoom', ({username, room}) => {
        socket.emit('message', formatMessage(admin , `Hello ${username}, Welcome to the SE3313 ${room} Discussion Room`));//send response to client after connection 
        console.log("Username: " + username);
        const user = userJoin(socket.id , username, room);
        console.log("New User Created")
       
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
        console.log("User Last Spoken: " + user);
        io.to(user.room).emit('message',formatMessage(user.username, msg)); //send the message back to all clients 
    });

});

const PORT = 3000 || process.env.PORT;

//checks if server running 
server.listen(PORT,  () => {
    console.log(`Server running on port ${PORT}`);
    if (process.pid) {
        console.log('This process is your pid ' + process.pid);
        let kill = `kill ${process.pid}`
        fs.writeFile('shutdown.sh', kill, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            console.log('Kill Switch Saved!');
        });
    }
});

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    io.emit('shutDown');
    io.close(() => {
        server.close(() => {
            console.log('Http server closed.');
        });
    });
});