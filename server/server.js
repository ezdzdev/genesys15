//socket IO and express setup
var http = require('http');
var express = require('express');
var port = 3000;
var app = express();
var server = http.createServer(app);
server.listen(port);  //listen on port 80

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


app.get('/', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});

app.get('/get', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});

app.post('/create', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});

app.get('/addBid', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});