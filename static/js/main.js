const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');

//get username and room from URL 
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});

//Join Chat room 
socket.emit('joinRoom', {username, room})


//listen for response from server 
socket.on('message', message => {
    console.log(message);
    outPutMessage(message);

    //scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value; //gets value of the input 

    socket.emit('chatMessage', msg); //emit message to server 

    //clear input box 
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//output to DOM 
function outPutMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span> </p>
    <p     
    <p class="text"> ${message.message} </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}