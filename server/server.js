//socket IO and express setup
var http = require('http');
var express = require('express');
var port = 80;
var app = express();
var server = http.createServer(app);
server.listen(port); //listen on port 80

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var sys = require('sys');
var exec = require('child_process').exec;
var child;


var id_global = 1000;

var userSchema = mongoose.Schema({
	id: Number,
	name: String,
	price: String,
	address: String,
	date: String,
	url: String,
	bidders: [mongoose.Schema.Types.Mixed]
});

var User = mongoose.model('User', userSchema);

app.get('/', function(req, nocache, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/new', function(req, nocache, res) {
  res.sendFile(__dirname + '/new.html');
});

app.get('/api/', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.find({}, function(err, users) {
		if (err) {
			res.send("not_ok");
		} else {

			res.send(users);
		}
	});
});

app.get('/api/url', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	var url = req.query.url;
	var bash_command = "ruby scripts/scrap.rb " + url;

	child = exec(bash_command, function(error, stdout, stderr) {
		console.log("error:" + error);
		console.log("this is :" + stdout);
		var payload = JSON.parse(stdout);
		if (!error) {
			var user = new User({
				id: id_global,
				name: payload.name,
				price: payload.price,
				address: payload.addr,
				date: payload.date,
				url: payload.url,
			});
			user.save(function(err) {
				if (err) {
					res.send("not_ok");
				} else {
					res.send(id_global.toString());
					console.log(user);
					id_global++;
				}
			});
		}
	});
});

app.get('/api/get', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.findOne({
		id: req.query.id
	}, function(err, user) {

		if (err) {

			res.send("not_ok");
		} else {

			res.send(user);
			console.log(user);
		}

	});
});

app.get('/api/create', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	var user = new User({
		id: id_global,
		name: req.query.name,
		address: req.query.address
	});

	user.save(function(err) {
		if (err) {
			res.send("not_ok");
		} else {
			res.send(id_global.toString());
			console.log(user);
			id_global++;
		}
	});
});

app.get('/api/addBid', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.findOne({
		id: req.query.id
	}, function(err, user) {

		if (err) {

			res.send("not_ok");
		} else {

			user.bidders.push({
				name: req.query.name,
				tel: req.query.tel,
				price: req.query.price
			});

			user.save(function(err) {
				if (err) {
					res.send("not_ok");
				} else {
					res.send(user);
					console.log(user);
				}
			});

		}

	});

});

app.get('/api/id_exists', function(req, nocache, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.findOne({
		id: req.query.id
	}, function(err, user) {

		if (err) {

			res.send("not_ok");
		} else {

			if(user){

				res.send({result:"true"});
			}else{

				res.send({result:"false"});
			}

		}

	});
});

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}