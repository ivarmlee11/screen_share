module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("peer");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(1);

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

var ExpressPeerServer = __webpack_require__(2).ExpressPeerServer;

const server = _http2.default.Server(app);

var options = {
	debug: true,
	allow_discovery: true
};

const peerServer = ExpressPeerServer(server, options);
app.use('/api', peerServer);

peerServer.on('connection', function (id) {
	console.log(id);
	console.log(server._clients);
});

peerServer.on('disconnect', function (id) {
	console.log(id + "deconnected");
});

const io = __webpack_require__(3)(server);

const PORT = process.env.PORT || 3000;

let users = [];

io.on('connection', client => {
	const id = client.id;
	console.log(`client connected ${id}`);
	users.push(client);
	console.log(users.length);

	client.on('join', namespace => {
		console.log(`${id} joined ${namespace}`);
		client.join(namespace);
	});

	client.on('message', data => {

		console.log(`
			data recieved server side 
			peerjs id ${data.peerJsId}
			socketid ${data.socketId}
			location ${data.location}
		`);

		// send message to client namespace
		client.to(data.location).emit('message', {
			'peerJsId': data.peerJsId,
			'socketid': data.socketId
		});
	});

	client.on('disconnect', client => {
		console.log(`client disconnected ${id}`);
		let i = users.indexOf(client);
		users.splice(i, 1);
		console.log(users.length);
	});
});

app.use(_express2.default.static('public'));

app.get('/', (req, res) => {
	res.render('/index.html');
});

server.listen(PORT, err => {

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

/***/ })
/******/ ]);