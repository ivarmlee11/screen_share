import express from 'express';
import http from 'http';

const app = express();

app.use(express.static('public'));

const server = http.Server(app);

const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;


// const peerServer = app.listen(PORT);

const ExpressPeerServer = require('peer').ExpressPeerServer;

const options = {
	debug: true
};

app.use('/api', ExpressPeerServer(server, options));

let users = [];

io.on('connection', (client) => {
	const id = client.id;
	console.log(`socket client connected ${id}`);
	users.push(client);
	console.log(users.length);

	client.on('join', (namespace) => {
		console.log(`socket ${id} joined ${namespace}`);
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
    console.log(`socket client disconnected ${id}`);
    let i = users.indexOf(client);
    users.splice(i, 1);
    console.log(users.length);
  });

});


app.get('/', (req, res) => {
	res.render('/index.html');
});

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