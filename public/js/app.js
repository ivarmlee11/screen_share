// if you want to check if chrome extension is installed and enabled
isChromeExtensionAvailable((isAvailable) => {
  if (!isAvailable) {
    console.log('Chrome extension is either not installed or disabled.');
  } else {
    console.log('Screen sharing extension is enabled.');
  }
});

getSourceId(function(sourceId) {

  console.log(sourceId);

  if(sourceId != 'PermissionDeniedError') {

    getScreenConstraints(function(error, screen_constraints) {
      if (error) {
          console.log(error);
      }

      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
     
      navigator.getUserMedia({

        video: {
            width: {
              max: 1920,
            },
            height: {
              max: 1080,
            },
            frameRate: { 
              max: 10,
            },
            deviceId: {
              exact: [sourceId],
            },
            mediaStreamSource: {
              exact: ['desktop'],
            }
          }

      }, function(stream) {
          console.log(stream);
          var video = document.getElementById('video');
          video.src = URL.createObjectURL(stream);
          video.play();
      }, function(error) {
          console.log(error);
      });
    });

  }
});

