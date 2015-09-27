//socket IO and express setup
var express = require('express');
var port = 3000;
var app = express();
var server = require('http').createServer(app).listen(port);
var io = require('socket.io').listen(server);

//hashing setup for generating session ids
var Hashids = require("hashids"); //this library is used to generate session ids
hashids = new Hashids("Siva made this");

//setup redis pubsub
var redis = require("redis");
var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe("server communication channel");

//querystring to parse and generate string for server to server communicaiton
var querystring = require('querystring');


//this app_module has all of the key redis functionality
var redis_func = require("./redis_session");


//The following variables will keep track of all the clients connected to this server/instance of server.js
var clients = []; //array of clients connected
var sessions = []; //array keeps track of how many users in the sesson
var user_session = []; //array keeps track of what session each user is in

//the server listens for the following events from all the connected clients
sub.on("subscribe", function(channel, count) { //proceed with the socket.io stuff after the server has subscribed to the redis server

	io.sockets.on('connection', function(socket) { //hanshake for when the client connects

		var username = socket.handshake.query.username; //user name (passed in the handshake querry)
		var token = socket.handshake.query.token; //authenticate this token

		clients[username] = socket; //add user to the clients array
		console.log("connected   :   " + username);

		socket.on('disconnect', function() { //when client disconnects from the server (eg battery failure/loss of internest connection)

			delete clients[username]; //delete user from the clients array
			console.log('disconnected   :   ' + username);

		});

		socket.on('start_session', function(data) { //when a client wants to start a session
			var num_invitee = data.friends.length; //stores the required number of responses
			redis_func.gen_session(num_invitee, function(session_id) { //generates a unique session id	
				redis_func.session_add_user(data.user, session_id); //add the user to the session
				for (i = 0; i < num_invitee; i++) { //ask the servers to send all the selected users a request
					var request_data = { //JSON object containg the request data
						type: 'request',
						from: data.user,
						to: data.friends[i],
						session_id: session_id,
						city: data.city,
						lat: data.latitude,
						lon: data.longitude
					};
					var request_data_querry = querystring.stringify(request_data); //convert the JSON object to a querry string
					pub.publish('server communication channel', request_data_querry); //publish the data to the redis server
				}
			});
		});

		socket.on('respond_session', function(data) {
			var session_id = data.session_id;
			redis_func.decr_session(session_id, function(err, status) { //decrement the number of required responses count

				if (data.status === "accepted") { //if the user accepts
					redis_func.session_add_user(data.user, session_id);
				}
				redis_func.read_session(session_id, function(err, reply) { //read the number of required responses
					if (reply === '0') { //if no more resposes are required
						redis_func.session_read_users(session_id, function(err, users) {
							for (i = 0; i < users.length; i++) {
								var accepted_data = { //JSON object containg the request data
									to: users[i],
									type: 'accepted',
									session_id: session_id,
								};
								var accepted_data_query = querystring.stringify(accepted_data); //convert the JSON object to a querry string
								pub.publish('server communication channel', accepted_data_query); //publish the data to the redis server
							}
						});
					}
				});
			});

		});
		socket.on('client_push', function(data) { //when a client pushes data to the server
			redis_func.session_read_users(data.session_id, function(err, users) {
				if (users.indexOf(data.user) === -1) { //check if ghe user is part of this session
					socket.emit('server_push', users);
				} else {
					for (i = 0; i < users.length; i++) {
						var push_data = { //JSON object containg the request data
							to: users[i], //user this push is going to
							from: data.user, //the user that pushed the data
							type: 'push',
							res: data.res_name, //restaurent identifier
							result: data.result //did the user swipe left or right?
						};
						var push_data_query = querystring.stringify(push_data); //convert the JSON object to a querry string
						pub.publish('server communication channel', push_data_query); //publish the data to the redis server
					}
				}
			});
		});
	});



	io.sockets.on('end_session', function() { //when a client wants to end the session

		//session responses are going to be stored under session_id_responses


	});


});

sub.on("message", function(channel, message) {
	var data = querystring.parse(message); //parse the incomming query string

	if (clients[data.to] !== undefined) { //if the user is connected to this sever

		if (data.type === "request") { //if the incomming data is a request

			clients[data.to].emit("session_request", data);
		}

		if (data.type === 'accepted') { //send all the users in the session an accepted event
			redis_func.session_read_users(data.session_id, function(err, users) { //search up all the users in the session
				clients[data.to].emit("session_accepted", { //send a event to the client
					session_id: data.session_id, //session id
					users: users //array of users in the session
				});
			});
		}
		if (data.type === "push") {
			console.log(data);
			clients[data.to].emit("server_push", { //send a event to these users
				session_id: data.session_id, //session id
				from: data.from,
				res_name: data.res,
				result: data.result
			});


		}
	}

});


//this code is just for testing purposes

app.get('/', function(req, res) { //hosting this index.html page for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/index.html");

});
app.get('/index.js', function(req, res) { //hosting the testing js file for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/index.js");

});
app.get('/gimme_j_querry', function(req, res) { //hosting the testing js file for tesging the client side. please comment out when running the API

	res.sendFile(__dirname + "/client_side_libs/jquery-2.1.1.js");

});