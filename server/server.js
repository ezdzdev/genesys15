//socket IO and express setup
var express = require('express');
var port = 3000;
var app = express();

app.get('/', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/index.html");

});
app.get('/index.js', function(req, res) { //hosting the testing js file for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/index.js");

});
app.get('/gimme_j_querry', function(req, res) { //hosting the testing js file for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/client_side_libs/jquery-2.1.1.js");

});