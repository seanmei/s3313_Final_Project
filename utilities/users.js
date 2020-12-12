const users = []; 


//join user to chat 
function userJoin(id, username, room){
    const user = {id, username, room}

    users.push(users)

    return users;

}

//get current user 
function getCurrentUser(id){
    return users.find(user => user.id === id );


}

module.exports = {
    userJoin,
    getCurrentUser}