import express from 'express';

const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('/index.html');
});

app.listen(PORT, err => {
	if (err) {
		throw err;
	} else {
		// console.log(`
		// 	server running on ${PORT}
		// 	-----
		// 	running on ${process.env.NODE_ENV}
		// 	----- 
		// `)
	}
});