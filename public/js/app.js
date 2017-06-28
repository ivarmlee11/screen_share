// if you want to check if chrome extension is installed and enabled
let outStream;

isChromeExtensionAvailable((isAvailable) => {
  if (!isAvailable) {
    console.log('Chrome extension is either not installed or disabled.');
  } else {
    console.log('Screen sharing extension is enabled.');
  }
});

getSourceId((sourceId) => {

  console.log(`source id ${sourceId}`);

  if(sourceId != 'PermissionDeniedError') {

    getScreenConstraints((error, screen_constraints) => {
      if (error) {
        console.log('error');
        console.log(error);
      }

      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
     
      navigator.getUserMedia({

        video: screen_constraints

      }, (stream) => {
        console.log('outgoing stream');
        console.log(stream);
        outStream = stream;
        let video = document.getElementById('outgoing');
        video.src = URL.createObjectURL(outStream);
        video.play();
      }, (error) => {
        console.log(error);
      });
    });

  }
});

// connect to socket io 
const socket = io();

// peer js set up
const peer = new Peer({
  host: location.hostname,
  port: location.port || (location.protocol === 'https:' ? 443 : 80),
  path: '/api'
});

const loc = window.location.pathname;

peer.on('open', (id) => {
  
  console.log(`
    My peer js ID is: ${id}
    My socket io ID is: ${socket.id}
  `);
  
  socket.emit('join', loc);
  
  socket.emit('message', 
  {
    peerJsId: id,
    socketId: socket.id,
    location: loc
  });

});

socket.on('message', (data) => {
  console.log(`
    ${data.peerJsId} connected to this page
    attempting to call this user with peer js
    sending media stream
  `);
  console.log(outStream);
  let call = peer.call(data.peerJsId, outStream);
});

peer.on('call', (call) => {
  console.log('call came in');
  console.log(call);
  call.answer(outStream);
  call.on('stream', (stream) => {
    let videoIn = document.getElementById('incoming');
    videoIn.src = URL.createObjectURL(stream);
    videoIn.play(); 
  });

});

