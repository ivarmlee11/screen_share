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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, __dirname) {

var fs = __webpack_require__(11);
var path = __webpack_require__(12);
var Sequelize = __webpack_require__(0);
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = __webpack_require__(8)[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module), "/"))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (sequelize, DataTypes) {
  var share = sequelize.define('share', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
      }
    }
  });
  return share;
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("peer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
	"development": {
		"database": "screen_share_development",
		"host": "127.0.0.1",
		"dialect": "postgresql"
	},
	"test": {},
	"production": {
		"use_env_variable": "DATABASE_URL"
	}
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(4);

var app = express();

var http = __webpack_require__(5);

var Sequelize = __webpack_require__(0);

var db = __webpack_require__(1);

var share = __webpack_require__(2);

var bodyParser = __webpack_require__(3);

app.use(bodyParser.urlencoded({ extended: true }));

var PORT = process.env.PORT || 3000;

var server = http.Server(app);

var io = __webpack_require__(7)(server);

var ExpressPeerServer = __webpack_require__(6).ExpressPeerServer;

var options = {
	debug: true
};

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/api', ExpressPeerServer(server, options));

var users = [];

io.on('connection', function (client) {
	var id = client.id;
	console.log(`socket io client connected with this id: ${id}`);
	users.push(client);
	console.log(users.length);

	client.on('join', function (namespace) {
		console.log(`socket io client id: ${id} joined ${namespace}`);
		client.join(namespace);
	});

	client.on('message', function (data) {

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

	client.on('disconnect', function (client) {

		console.log(`socket io client ${id} disconnected ${id}`);
		var i = users.indexOf(client);
		users.splice(i, 1);
		console.log(users.length);
	});
});

app.get('/', function (req, res) {
	res.render('index');
});

app.post('/', function (req, res) {
	console.log(req.body);
	db.shareDb.findOrCreate({
		where: {
			name: req.body.name
		}
	}).spread(function (share, created) {
		if (created) {
			var name = share.name;
			var redirectString = `/share/${name}`;
			res.redirect(redirectString);
		} else {
			res.redirect('back');
		}
	});
});

app.get('/shared/:sharelink', function (req, res) {
	res.render('sharesplash', { shared: req.params.sharelink });
});

app.get('/share/:name', function (req, res) {
	res.render('share');
});

server.listen(PORT, function (err) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);