var loginElement=document.querySelector('#login');
var chatElement=document.querySelector('#chat');
var userForm=document.querySelector('#userForm');
var connection=document.querySelector('#connect');
var mainChat=document.querySelector('#main-chat');
var sms=document.querySelector('#sms');
var sendDiv=document.querySelector('#sendDiv');
var main=document.querySelector('#main');
var userName=null;
var stomp=null;
var users =null;
var URL="http://localhost:8080"
function connectionSocket(event){
    userName=document.querySelector('#username').value.trim();
    if(userName){
        loginElement.classList.add("dis");
        chatElement.classList.remove("dis");
        var socket=new SockJS(URL+'/connect');
        stomp=Stomp.over(socket);
        stomp.connect({},connectionDone);
    }
    event.preventDefault()
}

function connectionDone(){
    stomp.subscribe("/topic/all",sendMessage);
    stomp.send("/app/chat.logIn",{},
        JSON.stringify({sender:userName,chatType:"JOIN"})
        );

    connection.classList.add("dis");
}

function sendMessage(payload){
    var message=JSON.parse(payload.body);
    if(message.chatType=='JOIN'){
        joinUser(message,'join');
        listActiveUsers()
    }else if(message.chatType=='LEAVE'){
        joinUser(message,"leave");
        listActiveUsers()
    }else{
//        console.log("****************8Chat");
        var li=document.createElement('li');
        li.classList.add('sms');
        var image=document.createElement('img');
        image.src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
//        image.src="C:\\Users\\ASUS\\Downloads\\Screenshot.jpeg";
//        image.src="file:///C:\\Users\\ASUS\\Downloads\\Socket-chat-app\\Socket-chat-app\\src\\main\\resources\\person.jpeg";
        var span1=document.createElement('span');
        span1.classList.add('my-message');
        var span2=document.createElement('span');
        span2.classList.add('user');
        var span2User= document.createTextNode(message.sender);
        span2.appendChild(span2User);
        var span3=document.createElement('span');
        span3.classList.add('mes');
        var span3Message= document.createTextNode(message.message);
        span3.appendChild(span3Message);
        span1.appendChild(span2);
        span1.appendChild(span3);
        li.appendChild(image);
        li.appendChild(span1);
        mainChat.appendChild(li);
    }

}
function joinUser(message,state){
    var li1=document.createElement('li');
    var li2=document.createElement('li');
    var hr1=document.createElement('hr');
    var hr2=document.createElement('hr');
    var messageJoin=document.createTextNode(message.sender+" "+state);
    li1.classList.add('status');
    li1.appendChild(messageJoin);
    li2.appendChild(hr1);
    li2.appendChild(li1);
    li2.appendChild(hr2);
    mainChat.appendChild(li2);
}
function send(){
   var messageUser=sms.value.trim();
   if(messageUser && stomp){
        var userMessage={
            message:messageUser,
            sender:userName,
            chatType:'CHAT'
        }
        stomp.send("/app/chat.send",{},JSON.stringify(userMessage));
        sms.value='';
   }
//   event.preventDefault();
}
function listActiveUsers(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", URL + "/active");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            users = JSON.parse(xhr.responseText);
            showActiveUser(users);
        }
    };
    xhr.send();
}
function showActiveUser(users){
    document.getElementById('test').remove();
    mainDiv=document.createElement('div');
    mainDiv.classList.add('abso');
    mainDiv.id='test';
    for(var j=0;j<users.length;j++){
        var div=document.createElement('div');
        var span1=document.createElement('span');
        span1.classList.add('name-us');
        var newJoinUser=document.createTextNode(users[j].username);
        span1.appendChild(newJoinUser);
        var span2=document.createElement('span');
        var i=document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-circle');
        span2.appendChild(i);
        div.appendChild(span1);
        div.appendChild(span2);
        mainDiv.appendChild(div);
    }
    main.appendChild(mainDiv);
}

userForm.addEventListener('submit',connectionSocket)
sendDiv.addEventListener('click',send)
