var SamplePlayer = require('../index');
var generateBrownNoise = require('openmusic-brown-noise');

// register the oscilloscope component so we can use it
require('openmusic-oscilloscope').register('openmusic-oscilloscope');
require('openmusic-slider').register('openmusic-slider');

var ac = new AudioContext();
var player = SamplePlayer(ac);
var analyser = ac.createAnalyser();
var oscilloscope = document.querySelector('openmusic-oscilloscope');

player.connect(analyser);
analyser.connect(ac.destination);

oscilloscope.attachTo(analyser);

document.querySelector('button').addEventListener('click', onStartPressed);
document.querySelector('input[type=checkbox]').addEventListener('change', onLoopChanged);

var loopStart = document.getElementById('loopStart');
var loopEnd = document.getElementById('loopEnd');

loopStart.addEventListener('input', ensureLoopSanity);
loopEnd.addEventListener('input', ensureLoopSanity);

var request = new XMLHttpRequest();
request.open('GET', 'data/amen.ogg', true);
request.responseType = 'arraybuffer';

request.onload = function() {
	ac.decodeAudioData(request.response, onBufferLoaded, onBufferLoadError);
};

request.send();

function onBufferLoaded(buffer) {
	player.buffer = buffer;
}

function onBufferLoadError(err) {
	console.error('oh no', err);
}

function onStartPressed() {
	player.start();
}

function onLoopChanged() {
	player.loop = this.checked;
}

function ensureLoopSanity(e) {
	// don't let loopEnd be < loopStart, and the opposite
	var startValue = loopStart.value * 1;
	var endValue = loopEnd.value * 1;

	if(this === loopStart && ( startValue >= endValue )) {
		e.preventDefault();
		e.stopPropagation();
		loopStart.value = endValue - 0.01;
	} else if(this === loopEnd && ( endValue <= startValue )) {
		e.preventDefault();
		e.stopPropagation();
		loopEnd.value = startValue + 0.01;
	}

	// The loop points are in seconds
	// Interestingly Chrome won't play anything at all if the loop points are 'outside' the sample duration
	var sampleLength = player.buffer.length / ac.sampleRate;

	player.loopStart = sampleLength * loopStart.value;
	player.loopEnd = sampleLength * loopEnd.value;

}
