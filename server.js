var express = require('express');       // web server application
var http = require('http');             // http basics
var app = express();                    // instantiate express server
var server = http.Server(app);          // connects http library to server
 // connect websocket library to server
var serialport = require('serialport'); // serial library
var serverPort = 8000;
// var child_process = require('child_process');
// var exec = child_process.exec;
var request = require('request');
var fs = require('fs');
var vcapServices = require('vcap_services');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var WebSocket = require('ws');
// var PythonShell = require('python-shell');

app.use(require('body-parser').json());

var langToWatson = {
	'en': 'en-US_AllisonVoice', 
	'es': 'es-ES_LauraVoice',
	'de': 'de-DE_BirgitVoice',
	'ja': 'ja-JP_EmiVoice',
	'fr': 'fr-FR_ReneeVoice'
}

// curl -k https://localhost:8000/
const https = require('https');

const options = {
  key: fs.readFileSync('test-key.pem'),
  cert: fs.readFileSync('test-cert.pem'),
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var httpsServer = https.createServer(options, app);
httpsServer.listen(443);
var io = require('socket.io')(httpsServer); 

var httpServer = http.createServer(app);
httpServer.listen(80);

// start the serial port connection and read on newlines
var serial = new serialport.SerialPort(process.argv[2], {
	baudrate: 9600
});

// /*// start face tracking
// var pyshell = new PythonShell('/stream.py');

// var moving = 0;
// pyshell.on('message', function (message) {
// 	// received a message sent from the Python script
// 	console.log(message);
// 	if (message.includes(',')){
// 		var coord = message.split(',');
// 		var x = -1 * (parseFloat(coord[0]) - 0.5);
// 		var y = -1 * (parseFloat(coord[1]) - 0.5);
// 		// if (moving ==0) 
// 		getAngles(x,y);
// 	}
// });

// function getAngles(x,y){
// 	moving = 1;
// 	serial.flush();
// 	var panangle = Math.floor(90*x);
// 	if(panangle < 0) panangle += 360;
// 	console.log('pan: ' + panangle);
// 	if (panangle > 15 && panangle < 345){
// 		var d3 = Math.floor(panangle / 100).toString();
// 		var d2 = (Math.floor(panangle / 10) % 10).toString();
// 		var d1 = Math.floor(panangle % 10).toString();
// 		serial.write('p'+ d3 + d2 + d1 + '\n');
// 	}
// 	// var tiltangle = Math.floor(90*y);
// 	// if(tiltangle < 0) tiltangle += 360;
// 	// console.log('tilt: ' + tiltangle);
// 	// if (tiltangle > 12 && tiltangle < 348){
// 	// 	var d3 = Math.floor(tiltangle / 100).toString();
// 	// 	var d2 = (Math.floor(tiltangle / 10) % 10).toString();
// 	// 	var d1 = Math.floor(tiltangle % 10).toString();
// 	// 	serial.write('t'+ d3 + d2 + d1 + '\n');
// 	// }
// }

// // end the input stream and allow the process to exit 
// pyshell.end(function (err) {
// 	if (err) throw err;
// 	console.log('finished');
// });*/

// // var audioOut = [ 0, 0, 0, 0, 0, 0 ];
// // var audioThreshold = 0.8;
// // var audioIndex = 0;

// // var java = child_process.spawn('java', ['Main']);
// // java.stdout.on('data', function(data){
// // 	// console.log('stdout: ' + data);
// // 	audioOut[audioIndex] = parseFloat(data);
// // 	audioIndex = (audioIndex + 1) % audioOut.length;
// // 	var avg = 0;
// // 	for(var i in audioOut){
// // 		avg += audioOut[i];
// // 	}
// // 	avg /= audioOut.length;

// // 	if(avg < -1* audioThreshold){
// // 		// set robot left
// // 		console.log('set robot left');
// // 		serial.write('p125\n');
// // 	} else if(avg > audioThreshold){
// // 		// set robot right
// // 		console.log('set robot right');
// // 		serial.write('p045\n')
// // 	}
// // });

// // use express to create the simple webapp
// app.use(express.static('public'));		// find pages in public directory

// // check to make sure that the user calls the serial port for the arduino when
// // running the server
// if(!process.argv[2]) {
// 	console.error('Usage: node '+process.argv[1]+' SERIAL_PORT');
// 	process.exit(1);
// }

// // this is the websocket event handler and say if someone connects
// // as long as someone is connected, listen for messages
// io.on('connect', function(socket) {
// 	// var ws = new WebSocket('ws://andrea-pi:8084/');

// 	// ws.on('open', function open(){
// 	// 	console.log('WebSocket open');
// 	// });

// 	// ws.on('message', function message(data, flags){
// 	// 	// console.log(data.length);
// 	// 	socket.emit('imgdata', data);
// 	// 	// console.log(data);
// 	// 	// console.log(flags);
// 	// });

// 	console.log('a user connected');

// 	// if you get the 'play' message, play the clip number by id
// 	socket.on('play', function(id) {
// 		console.log('play sound', id);
// 		//exec(command, callback); play a sound from the sound clips libary using ALSA aplay
// 		console.log('aplay public/sound-' + id + '.wav -D plughw:1,0');
// 		exec('aplay public/sound-' + id + '.wav -D plughw:1,0', function(err,stdout,stderr) {
// 		  if (err) {
// 			console.log('Child process exited with error code', err.code);
// 			return
// 		  }
// 		  console.log(stdout);
// 		});
// 	});

// 	// if you get the 'panLeft' msg, send an 'a' to the arduino
// 	socket.on('panLeft', function() {
// 		console.log('panLeft');
// 		serial.write('a' + '\n');
// 	});

// 	// if you get the 'panRight' msg, send an 'd' to the arduino
// 	socket.on('panRight', function() {
// 		console.log('panRight');
// 		serial.write('d' + '\n');
// 	});

// 	// if you get the 'tiltUp' msg, send an 'w' to the arduino
// 	socket.on('tiltUp', function() {
// 		console.log('tiltUp');
// 		serial.write('w' + '\n');
// 	});

// 	// if you get the 'tiltDown' msg, send an 's' to the arduino
// 	socket.on('tiltDown', function() {
// 		console.log('tiltDown');
// 		serial.write('s' + '\n');
// 	});

// 	// if you get the 'disconnect' message, say the user disconnected
// 	socket.on('disconnect', function() {
// 		console.log('user disconnected');
// 	});

// 	// socket.

// 	socket.on('say', function(message){
// 		console.log('beginning to say "' + message.text + '"...'); 
// 		getAudio(message.text, langToWatson[message.language], function(){
// 			//exec(command, callback); play a sound from the sound clips libary using ALSA aplay
// 			console.log('play text: ' + message.text);
// 			exec('aplay public/audio/temp.wav -D plughw:1,0', function(err,stdout,stderr) {
// 			  if (err) {
// 				console.log('Child process exited with error code', err.code);
// 				return
// 			  }
// 			  console.log(stdout);
// 			});
// 		})
// 	});
// 	socket.on('usersays', function(text){
// 		console.log("usersays: " + text);
// 		// bot.ask(text, function (err, response) {
// 		// 	console.log("cleverbot says: " + response);
// 		// 	if (err){
// 		// 		console.log('Error: ' + err);
// 		// 	}
// 		// 	getAudio(response, function(){
// 		// 		//exec(command, callback); play a sound from the sound clips libary using ALSA aplay
// 		// 		console.log('play text: ' + response.message);
// 		// 		exec('aplay public/audio/temp.wav -D plughw:1,0', function(err,stdout,stderr) {
// 		// 		  if (err) {
// 		// 			console.log('Child process exited with error code', err.code);
// 		// 			return
// 		// 		  }
// 		// 		});
// 		// 	})
// 		// });
// 	});
// 	socket.on('setPanAngle', function(angle){
// 		console.log('Setting Angle to: ' + angle);
// 		serial.write('p'+ angle + '\n');
// 	});
// });

// this is the serial port event handler.
// read the serial data coming from arduino - you must use 'data' as the first argument
// and send it off to the client using a socket message
serial.on('data', function(data) {
	console.log('data:', data);
	moving = 0;
	io.emit('server-msg', data);
});

// start the server and say what port it is on
server.listen(serverPort, function() {
	console.log('listening on *:%s', serverPort);
});



var username = "a78d8147-7e1d-4b30-a354-5aa721687651";
var password = "WSjqV1vwLMgZ";
var url = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=";
//en-US_AllisonVoice";
//var url = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=es-ES_LauraVoice"
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function getAudio(text, language, finishCallback){
	var language = language || 'en-US_AllisonVoice';

	var body = '{ "text": "' + text + '"}';//"<speak><express-as type=\\"Uncertainty\\">' + text + '</express-as></speak>" }';
	console.log(body);

	console.log(url + language);

	//var stream = fs.createWriteStream('public/audio/' + 'test' +'.wav');
	request.post({
		url : url + language,
		headers : {
			'content-type': 'application/json',
			"Authorization" : auth,
			'Accept': 'audio/wav'
		},
		body: body,
		//voice: ,
		encoding: null
	},
	function(err, res){
		if(res){
			fs.writeFileSync('public/audio/temp.wav', res.body);
			if(finishCallback){
				finishCallback();
			}
		}

		if(err){
			console.log(err);
		}
	});
}

// var Cleverbot = require('cleverbot-node');
// cleverbot = new Cleverbot;
// Cleverbot.prepare(function(){});

// var cleverbot = require('cleverbot.io');
// bot = new cleverbot('CqbxdyrmgOlIcI2v', 'vUF8dP5o4e8LSxZdHVPSLqZDHtfQL8Tk');
// bot.setNick("pehuen");
// bot.create(function (err, session) {
//   // session is your session name, it will either be as you set it previously, or cleverbot.io will generate one for you
  
//   // Woo, you initialized cleverbot.io.  Insert further code here
// });

var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || '90e6fbf9-6945-4834-a23e-9019df99bb82',
  password: process.env.STT_PASSWORD || 'KPyucsPqxZYn'
}, vcapServices.getCredentials('speech_to_text'));

// var authService = watson.authorization(config);

app.post("/setPanAngle", function(req, res){
	// console.log(req.body);
	var angle = req.query.a;//req.body.angle;
	console.log("angle: " + angle);
	console.log('Setting Angle to: ' + angle);
	serial.write('p'+ angle + '\n');
});

// Get token using your credentials
app.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
	if (err){
		console.log('token error:');
		console.log(err);
	  next(err);
	 } else{
		console.log(token);
		res.send(token);
	 }
  });
});