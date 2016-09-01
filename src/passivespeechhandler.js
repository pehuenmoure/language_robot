module.exports.onWakeUp = function(){};

module.exports.onSleep = function(){};

var time;
var sleeping = false;

module.exports.startGoogle = function(){
	var recognition = new webkitSpeechRecognition();
  	recognition.continuous = false;
  	recognition.interimResults = true;
    recognition.lang = "en";
    recognition.maxAlternatives = 3;

  	recognition.onresult = function(event){
        if (event.results[0].isFinal){
        	for (var i = 0; i < event.results[0].length; i++){
        		var transcript = event.results[0][i].transcript.toLowerCase();
	            console.log('Google heard: ' + transcript);
	            if (transcript.includes('cinnamon')){
	            	sleeping = false;
	            	module.exports.onWakeUp();
	            	break;
            	}
        	}
        	time = Date.now();
        }
  	}

    recognition.onend = function(event){
        console.log('end/starting google');
        recognition.start();
        var difference = (Date.now() - time)/1000;
        console.log('Time since speech: ' + difference);
        if (difference >= 30 && !(sleeping)){
        	sleeping = true;
        	module.exports.onSleep();
        }
    }

    console.log('Starting google');
    recognition.start();
    time = Date.now();
}