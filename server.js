/*
*@autor: Sebastiao Lucio Reis de Souza
*@description:  java script file that works as master server of the Unity Multiplayer Online Game
*@data: 05/09/19
*/
var express = require('express');//import express NodeJS framework module
var app = express();// create an object of the express module
var http = require('http').Server(app);// create a http web server using the http library
var io = require('socket.io')(http);// import socketio communication module


app.use(express.static(__dirname));


var clientLookup = {};// clients search engine

var sockets = {};//// to storage sockets


//open a connection with the specific client in unity
io.on('connection',function(socket){


 //print a log in node.js command prompt
 console.log('A user ready for connection!');

 //to store current client connection
 var current_player;


 //create a callback fuction to listening EmitPing() method in NetworkMannager.cs class
 socket.on('PING', function(pack){

   console.log('received from unity the message: '+pack.message);
   json_pack = {

     message: 'pong!!!'
   };

   //emit the message back to NetworkManager in Unity
   socket.emit("PONG",json_pack);

   //send in broadcast
   socket.broadcast.emit("PONG",json_pack);

 });//END_SOCKET.ON

//called by unity EmitJoin() method in NetworkManager class
 socket.on("JOIN_ROOM", function(pack){

   current_player = {

     name: pack.name,
     id: socket.id
   };
   
   console.log('[INFO] Player ' + current_player.name + ' connected!');

   //add current connected player in clientLookup list
   clientLookup[current_player.id] = current_player;
   
   socket.emit("JOIN_SUCCESS",current_player);//send to unity


 });//END_SOCKET.ON


});//END_IO.ON


//setup nodeJS server port to listenning the clients
http.listen(3000,function(){

  console.log('listening on 3000');
  
});//END_LISTEN

console.log('------- NodeJS server is running -------');
