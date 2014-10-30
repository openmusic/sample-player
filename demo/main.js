var SamplePlayer = require('../index');
var generateBrownNoise = require('openmusic-brown-noise');

// register the oscilloscope component so we can use it
require('openmusic-oscilloscope').register('openmusic-oscilloscope');

var ac = new AudioContext();
var player = SamplePlayer(ac);
var analyser = ac.createAnalyser();
var oscilloscope = document.querySelector('openmusic-oscilloscope');

player.connect(analyser);
analyser.connect(ac.destination);

oscilloscope.attachTo(analyser);

var request = new XMLHttpRequest();
request.open('GET', 'data/amen.ogg', true);
request.responseType = 'arraybuffer';

request.onload = function() {
	ac.decodeAudioData(request.response, onBufferLoaded, onBufferLoadError);
};

request.send();

function onBufferLoaded(buffer) {
	console.log('megabuffer', buffer);
	player.buffer = buffer;
	player.loop = true;
	// The loop points are in seconds
	// Interestingly Chrome won't play anything at all if the loop points are 'outside' the sample duration
	player.loopStart = 0.1;
	player.loopEnd = 0.3;
	player.start();
}

function onBufferLoadError(err) {
	console.error('oh no', err);
}
