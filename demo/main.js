var SamplePlayer = require('../index');
var generateBrownNoise = require('openmusic-brown-noise');
var arrayToAudioBuffer = require('openmusic-array-to-audiobuffer');

// register the oscilloscope component so we can use it
require('openmusic-oscilloscope').register('openmusic-oscilloscope');
require('openmusic-slider').register('openmusic-slider');

var ac = new AudioContext();
var analyser = ac.createAnalyser();
var oscilloscope = document.querySelector('openmusic-oscilloscope');
analyser.connect(ac.destination);
oscilloscope.attachTo(analyser);

initDemo1();
initDemo2();

function initDemo1() {

	var player = SamplePlayer(ac);

	player.connect(analyser);

	document.getElementById('playSample').addEventListener('click', onStartPressed);
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

}


function initDemo2() {

	var burstsInput = document.getElementById('bursts');
	var rateInput = document.getElementById('rate');
	
	var noiseData = generateBrownNoise(ac.sampleRate / 8); // 0.125 seconds of noise
	var buffer = arrayToAudioBuffer({
		context: ac,
		data: noiseData
	});
	var samplePlayer = SamplePlayer(ac);
	samplePlayer.connect(ac.destination);
	samplePlayer.buffer = buffer;
	
	document.getElementById('playNoise').addEventListener('click', function() {
		clearScheduledNoise();
		scheduleNoise();
	});

	function clearScheduledNoise() {
		samplePlayer.stop();
	}

	function scheduleNoise() {
		var bursts = burstsInput.value * 1.0;
		var rate = rateInput.value * 1.0;

		var now = ac.currentTime;
		console.log(now, bursts, rate);

		var when = now;

		for(var i = 0; i < bursts; i++) {
				
			samplePlayer.start(when);

			when += rate;
			
		}
	}
}
