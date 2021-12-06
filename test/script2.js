/*
capture des elements html et declaration de la taille de la video
*/
(function(){
    var streaming = false,
    video        = document.querySelector('#video'),
    cover        = document.querySelector('#cover'),
    canvas       = document.querySelector('#canvas'),
    photo        = document.querySelector('#photo'),
    startbutton  = document.querySelector('#startbutton'),
    width = 320,
    height = 0;

    /*
    demande d acces a l utilisateur.
    */
/*recupere la video avec le son */
    navigator.mediaDevices.getUserMedia({video : true, audio : true});
    var track = stream.getTracks();



    function(stream)
    {if(navigator.mediaDevices.)}
