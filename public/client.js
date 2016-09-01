console.log('connecting socket: ' + window.socket);
window.socket = window.socket || io();

// send out message over socket
function play(id) {
    window.socket.emit('play', id);
}

//send out tiltDown message when the 'S' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 40) {
        window.socket.emit('tiltDown');
        console.log("tilt down");
        return false;
    }
});

//send out tiltUp message when the 'W' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 38) {
        window.socket.emit('tiltUp');
        console.log("tilt up");
        return false;
    }
});

//send out panLeft message when the 'A' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 37) {
        window.socket.emit('panLeft');
        console.log("pan left");
        return false;
    }
});

//send out panRight message when the 'D' key is pressed 
$(document).keydown(function(e){
    if (e.keyCode == 39) {
        window.socket.emit('panRight');
        console.log("pan right");
        return false;
    }
});


$('#play-txt').on('click', function(){
    window.socket.emit('say', $('#txt-in').val());
});

function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

$(document).ready(function(){
    // window.socket.on('imgdata', function(data){
    //     var buffer = new Uint8Array(data);
    //     console.log(buffer.length);
    //     $('#img').attr('src', 'data:image/jpeg;base64,' + btoa(buffer));
    // });
    // var username = "a78d8147-7e1d-4b30-a354-5aa721687651";
    // var password = "WSjqV1vwLMgZ";
    // var url = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=es-ES_LauraVoice"
    // var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

});

window.say = function(txt){
    window.socket.emit('say', txt);
}
