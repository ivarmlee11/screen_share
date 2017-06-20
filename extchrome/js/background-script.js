// this background script is used to invoke desktopCapture API
// to capture screen-MediaStream.

let screenOptions = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(portOnMessageHanlder);
  
  // this one is called for each message from "content-script.js"
  function portOnMessageHanlder(message) {
    if(message == 'get-sourceId') {
      chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
    }

    if(message == 'audio-plus-tab') {
      screenOptions = ['audio', 'tab'];
      chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
    }
  }

  // on getting sourceId
  // "sourceId" will be empty if permission is denied.
  function onAccessApproved(sourceId) {

    if(!sourceId || !sourceId.length) {
      return port.postMessage('PermissionDeniedError');
    }

    port.postMessage({
      sourceId: sourceId
    });
  }
});

