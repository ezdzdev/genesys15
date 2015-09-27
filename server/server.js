//socket IO and express setup
var http = require('http');
var express = require('express');
var port = 80;
var app = express();
var server = http.createServer(app);
server.listen(port); //listen on port 80

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//var bidderSchema = mongoose.Schema({
//	name: String,
//	number: String,
//	price: String
//});
var id_global = 1000;

var userSchema = mongoose.Schema({
	id: Number,
	name: String,
	address: String,
	bidder: Array
});

var User = mongoose.model('User', userSchema);


app.get('/', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});

app.get('/get', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});

app.get('/create', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	var user = new User({
		id: req.id_global,
		name: req.name,
		address: req.address
	});

	user.save(function(err) {
		if(err){
			res.send("not_ok");
		}else{
			res.send(id_global);
			id_global++;
		}
	});
});

app.get('/addBid', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.send("I am senfing something");
	//res.sendFile(__dirname + "/index.html");

});