const users = []; 


//join user to chat 
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user)

    return user;

}

//get current user 
function getCurrentUser(id){
    return users.find(user => user.id === id );

}


//user leaves chat 
function  removeCurrentUser(id){
    users.filter(user => user.id!=id)
}

//get users in room 
function getRoomUsers(room){
    return users.filter(user => user.room === room)
};

module.exports = {
    userJoin,
    getCurrentUser,
    removeCurrentUser,
    getRoomUsers
}