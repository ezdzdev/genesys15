//socket IO and express setup
var http = require('http');
var express = require('express');
var port = 80;
var app = express();
var server = http.createServer(app);
server.listen(port); //listen on port 80
var requestify = require('requestify');

var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/test');

var sys = require('sys');
var exec = require('child_process').exec;
var child;


app.use(function(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
});


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

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/new', function(req, res) {
	res.sendFile(__dirname + '/new.html');
});

app.get('/api/', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.find({}, function(err, users) {
		if (err) {
			res.send("not_ok");
		} else {

			res.send(users);
		}
	});
});

app.get('/api/url', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

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

app.get('/api/get', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

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

app.get('/api/create', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

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

app.get('/api/addBid', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

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

app.get('/api/id_exists', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.findOne({
		id: req.query.id
	}, function(err, user) {

		if (err) {

			res.send("not_ok");
		} else {

			if (user) {

				res.send({
					result: "true"
				});
			} else {

				res.send({
					result: "false"
				});
			}

		}

	});
});

app.get('/api/text', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	User.findOne({
		id: req.query.id
	}, function(err, user) {

		if (!err) {

			var message = "A buyer would like to puchase: " + user.name + "for" + user.price + ". Please contact: " + req.query.from;
			var number = "6478655555";
			var request = "http://69.204.255.92/api/text/send?to=" + number + "&msg=" + message;

			requestify.get(request)
				.then(function(response) {
					// Get the response body (JSON parsed or jQuery object for XMLs)
					console.log(request);
					var now = moment();
					var formatted = now.format('YYYY-MM-DD HH:mm:ss Z');
					user.bidders.push({
						name: "same name",
						tel: req.query.from,
						time: formatted
					});

					user.save(function(err) {
						if (err) {
							res.send("not_ok");
						} else {
							res.send(user);
							console.log(user);
						}
					});

				});
		}

	});
});