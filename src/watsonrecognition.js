var initSocket = require('./socket').initSocket;
var Microphone = require('./Microphone');
var utils = require('./utils');
var speechhandler = require('./passivespeechhandler');

console.log('connecting socket: ' + window.socket);
window.socket = window.socket || io();

var modules = {
	'es': require('./spanish.js'),
	'en': require('./english.js'),
}

var fromLanguageModule = modules['en'];
var toLanguageModule = modules['es'];

var fromSocket = null;
var toSocket = null;

var toStreamOpenTime;
var fromStreamOpenTime;
var toStream = [['word', 123, 0.0],
				[' ', 123, 0.0]];

var fromStream = [['word', 123, 0.0],
				[' ', 123, 0.0]];

speechhandler.startGoogle();



speechhandler.onWakeUp = function(){
	console.log('Opening sockets');
	window.socket.emit('play', 0);
	toSocket = window.initWatsonSocket(toLanguageModule.watsonName, onToMessage);
	fromSocket = window.initWatsonSocket(fromLanguageModule.watsonName, onFromMessage);
};

speechhandler.onSleep = function(){
	console.log('Closing sockets');
	window.socket.emit('play', 1);
	toSocket.close();
	fromSocket.close();
}

function onToMessage(msg) {
    if (msg.results) {
      // Convert to closure approach
      // baseString = display.showResult(msg, baseString, model);
      // baseJSON = JSON.stringify(msg, null, 2);
      // display.showJSON(baseJSON);
    	if (msg.results[0].final){
	      	console.log('To lanuage: ' + msg.results[0].alternatives[0].transcript);
			for(var i = 0; i < msg.results[0].alternatives[0].timestamps.length; i++){
	      		var time = toStreamOpenTime + msg.results[0].alternatives[0].timestamps[i][1];
	      		var confidence = msg.results[0].alternatives[0].word_confidence[i][1];
	      		var word = msg.results[0].alternatives[0].word_confidence[i][0];
	      		//console.log([word, confidence, time]);
	      		toStream.push([word, confidence, time]);
	      	}

	  //     	var toPhrase = msg.results[0].alternatives[0].transcript;
			// if (toPhrase.includes(toLanguageModule.keyPhrase)){
			// 	translateQuery();	
			// } else {
			// 	//window.socket.emit('usersays', msg.results[0].alternatives[0].transcript);
			// }
    	}
    }
}

function onFromMessage(msg) {
    if (msg.results) {
		// Convert to closure approach
		// baseString = display.showResult(msg, baseString, model);
		// baseJSON = JSON.stringify(msg, null, 2);
		// display.showJSON(baseJSON);
		if (msg.results[0].final){
			console.log('From lanuage: ' + msg.results[0].alternatives[0].transcript);
			for(var i = 0; i < msg.results[0].alternatives[0].timestamps.length; i++){
				var time = fromStreamOpenTime + msg.results[0].alternatives[0].timestamps[i][1];
				var confidence = msg.results[0].alternatives[0].word_confidence[i][1];
				var word = msg.results[0].alternatives[0].word_confidence[i][0];
				//console.log([word, confidence, time]);
				fromStream.push([word, confidence, time]);
			}

			var foreignPhrase = msg.results[0].alternatives[0].transcript;
			if (foreignPhrase.includes(fromLanguageModule.keyPhrase)){
				translateQuery();	
			} else {
				// window.socket.emit('usersays', msg.results[0].alternatives[0].transcript);
			}
		}
    }
}

function translateQuery(){
	setTimeout(function(){
		console.log('searching for text to translate');
		var k = 0;
		while(fromStream[k][0] != fromLanguageModule.keyWord){
			k ++;
		}

		var t1 = Date.now();
		// while (k+1 >= fromStream.lenght) {//&& (Date.now()-t1) < 5000){
		// }
		if ((Date.now()-t1) >= 5000){
			window.say(fromLanguageModule.nullText);
		} else {
	  		console.log([k+1, fromStream.length]);
	  		time = fromStream[k+1][2];

	  		var min = 1000;
	  		var n;
	  		var temp;
	  		for (var i = 0; i < toStream.length; i++){
	  			temp = Math.abs(toStream[i][2] - time);
	  			if (temp < min){
	  				min = temp;
	  				n = i;
	  			}
	  		}

	  		var text = toStream[n][0];
	  		console.log(text);
	  		googleTranslate(text, function(res){
	  			var wrapped = fromLanguageModule.wrapResponse(res);
	  			console.log(wrapped);
	  			window.say(wrapped);
	  		});
  		}
	}, 2000);
}

function googleTranslate(text, callback){
	var googleTranslateKey = 'AIzaSyBlhc8-zb9oVfACQUEUa89i8-iFCbqesm0';
	var url = 'https://www.googleapis.com/language/translate/v2?key=' + googleTranslateKey 
		+ '&source=' + fromLanguageModule.languageCode 
		+ '&target='+  toLanguageModule.languageCode 
		+ '&q=' + text;
	url = encodeURI(url);
	var request = $.get(url, function(data){
		//console.log('success');
		var res = data.data.translations[0].translatedText;
		console.log(res);
		callback(res);
	}).fail(function(error) {
		console.log( "error: " + error);
	});
}

var tokenGenerator = utils.createTokenGenerator();
// Make call to API to try and get token
tokenGenerator.getToken(function(err, token) {
	var options = {};
	options.token = token;
	options.message = {
		'action': 'start',
		'content-type': 'audio/l16;rate=16000',
		'interim_results': true,
		'continuous': true,
		'word_confidence': true,
		'timestamps': true,
		'max_alternatives': 3,
		'inactivity_timeout': 600,
		'word_alternatives_threshold': 0.001,
	};

	localStorage.setItem('currentModel', 'en-US_BroadbandModel');
	localStorage.setItem('sessionPermissions', 'true');

	var mic = new Microphone({ bufferSize: 8192 });

	function onListening(socket) {
		var temp = mic.onAudio;
		mic.onAudio = function(blob) {
			if(temp){
				temp(blob);
			} 

			if (socket.readyState < 2) {
				socket.send(blob);
			}
		};
	}

	mic.record();	

	window.initWatsonSocket = function(watsonName, onMessage){
		options.model = watsonName;
		return initSocket(options, 
			function(){
				toStreamOpenTime = Date.now();
				console.log(toStreamOpenTime/1000);
			}, 
			onListening,
			onMessage, 
			function(error){console.log(error)}, 
			function(){});
	}

	toSocket = window.initWatsonSocket(toLanguageModule.watsonName, onToMessage);
	fromSocket = window.initWatsonSocket(fromLanguageModule.watsonName, onFromMessage);
});

$(document).ready(function(){
	$('#fromlanguage').on('change', function(){
		var lang = $(this).val();
		fromLanguageModule = modules[lang];
		fromSocket.close();
		fromSocket = window.initWatsonSocket(fromLanguageModule.watsonName, onFromMessage);
		console.log('changed fromlang: ' + lang); 
	});

	$('#tolanguage').on('change', function(){
		var lang = $(this).val();
		toLanguageModule = modules[lang];
		toSocket.close();
		toSocket = window.initWatsonSocket(toLanguageModule.watsonName, onToMessage);
		console.log('changed tolang: ' + lang); 
	});
});