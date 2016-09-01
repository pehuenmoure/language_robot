var socket = io();

// send out message over socket
function play(id) {
    socket.emit('play', id);
}

//send out tiltDown message when the 'S' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 83) {
        socket.emit('tiltDown');
        console.log("tilt down");
        return false;
    }
});

//send out tiltUp message when the 'W' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 87) {
        socket.emit('tiltUp');
        console.log("tilt up");
        return false;
    }
});

//send out panLeft message when the 'A' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 65) {
        socket.emit('panLeft');
        console.log("pan left");
        return false;
    }
});

//send out panRight message when the 'D' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 68) {
        socket.emit('panRight');
        console.log("pan right");
        return false;
    }
});