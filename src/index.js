'use strict';

const express = require('express');

const app = express();

const http = require('http');

const Sequelize = require('sequelize');

const db = require('../models');

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

const server = http.Server(app);

const io = require('socket.io')(server);

const ExpressPeerServer = require('peer').ExpressPeerServer;

const options = {
	debug: true
};

app.use('/api', ExpressPeerServer(server, options));

let users = [];

io.on('connection', (client) => {
	let id = client.id;
	console.log(`socket io client connected with this id: ${id}`);
	users.push(client);
	console.log(users.length);

	client.on('join', (namespace) => {
		console.log(`socket io client id: ${id} joined ${namespace}`);
		client.join(namespace);
	});

	client.on('message', (data) => {

		console.log(`
			data recieved server side 
			peerjs id ${data.peerJsId}
			socketid ${data.socketId}
			location ${data.location}
		`);

		// send message to client namespace
		client.to(data.location).emit('message',
		{
			'peerJsId': data.peerJsId,
			'socketid': data.socketId
		});

	});

	client.on('disconnect', (client) => {

    console.log(`socket io client ${id} disconnected ${id}`);
    let i = users.indexOf(client);
    users.splice(i, 1);
    console.log(users.length);
  });

});

app.get('/', (req, res) => {
	res.render('/index.html');
});

app.post('/', (req, res) => {
	console.log(req.body);
	console.log(db.findOrCreate)
	console.log(db.share)
	db.share.findOrCreate({
	  where: {
	    name: req.body.name
  	}
	}).spread((share, created) => {
		if(created) {
			let name = share.name
			let redirectString = `/share/${name}`;
	  	res.redirect(redirectString);	
		} else {
			res.redirect('back');
		}
	});
});

app.get('/share/:name', (req, res) => {
	console.log(req.params)
	res.render('/share.html');
})

server.listen(PORT, (err) => {

	if (err) {
		throw err;
	} else {
		console.log(`
			server running on ${PORT}
			-----
			running on ${process.env.NODE_ENV}
			----- 
		`);
	}

});