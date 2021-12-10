  const video = document.getElementById('webcam');
  const liveView = document.getElementById('liveView');
  const demosSection = document.getElementById('demos');
  const enableWebcamButton = document.getElementById('webcamButton');
  const StopWebcamButton = document.getElementById('stopButton');
  const webcamoutput = document.getElementById('webcamOutput');
  
  
  // Check if webcam access is supported.
  function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
 
  // Enable the live webcam view and start classification.
  function enableCam() {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
      return;
    }
    
  
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      console.log(video);
      video.addEventListener('loadeddata', predictWebcam);
      if(webcamoutput.style.display != 'block') {
        webcamoutput.style.display ='block';
      }
    }
      );
      
  };

        var StopWebCam = function () {
            var stream = video.srcObject;
            var tracks = stream.getTracks();

            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                track.stop();
            }
            video.srcObject = null;for (let i = 0; i < children.length; i++) {
              liveView.removeChild(children[i]);
            }
            children.splice(0);
            if(webcamoutput.style.display != 'none') {
              webcamoutput.style.display ='none';
            }
        }

  
  // Placeholder function for next step.
  function predictWebcam() {
  }
  
  // Pretend model has loaded so we can try out the webcam code.
  var model = true;
  demosSection.classList.remove('invisible');
  

  // Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
});
var children = [];
let comparaison_string;
let string_1;
let timer_stop;
let time_to_print;
const timer_start = performance.now();


function predictWebcam() {
  
  // Now let's start classifying a frame in the stream.
  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        string_1 = predictions[n].class;
        timer_stop = performance.now();
        time_to_print = (((timer_stop - timer_start)%60000) / 1000).toFixed(2);
        if (string_1 != comparaison_string)
          webcamoutput.innerText +='\n'+string_1+' detected at '+ time_to_print +" secondes";
          comparaison_string =string_1;
        
        liveView.appendChild(highlighter);
        liveView.appendChild(p);

        children.push(highlighter);
        children.push(p);
        
      }
      
    }

    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}
