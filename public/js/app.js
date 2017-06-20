// if you want to check if chrome extension is installed and enabled
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
        console.log('stream');
        console.log(stream);
        var video = document.getElementById('video');
        video.src = URL.createObjectURL(stream);
        video.play();
      }, (error) => {
        console.log(error);
      });
    });

  }
});

