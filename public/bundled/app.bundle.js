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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// if you want to check if chrome extension is installed and enabled
var outStream = void 0;

isChromeExtensionAvailable(function (isAvailable) {
  if (!isAvailable) {
    console.log('Chrome extension is either not installed or disabled.');
  } else {
    console.log('Screen sharing extension is enabled.');
  }
});

getSourceId(function (sourceId) {

  console.log(`source id ${sourceId}`);

  if (sourceId != 'PermissionDeniedError') {

    getScreenConstraints(function (error, screen_constraints) {
      if (error) {
        console.log('error');
        console.log(error);
      }

      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      navigator.getUserMedia({

        video: screen_constraints

      }, function (stream) {
        console.log('outgoing stream');
        console.log(stream);
        outStream = stream;
        var video = document.getElementById('outgoing');
        video.src = URL.createObjectURL(outStream);
        video.play();
      }, function (error) {
        console.log(error);
      });
    });
  }
});

// connect to socket io 
var socket = io();

// peer js set up
var peer = new Peer({
  host: location.hostname,
  port: location.port || (location.protocol === 'https:' ? 443 : 80),
  path: '/api'
});

var loc = window.location.pathname;

peer.on('open', function (id) {

  console.log(`
    My peer js ID is: ${id}
    My socket io ID is: ${socket.id}
  `);

  socket.emit('join', loc);

  socket.emit('message', {
    peerJsId: id,
    socketId: socket.id,
    location: loc
  });
});

socket.on('message', function (data) {
  console.log(`
    ${data.peerJsId} connected to this page
    attempting to call this user with peer js
    sending media stream
  `);
  console.log(outStream);
  var call = peer.call(data.peerJsId, outStream);
});

peer.on('call', function (call) {
  console.log('call came in');
  console.log(call);
  call.answer(outStream);
  call.on('stream', function (stream) {
    var videoIn = document.getElementById('incoming');
    videoIn.src = URL.createObjectURL(stream);
    videoIn.play();
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);