function SamplePlayer(context) {
	var node = context.createGain();
	var bufferSource;
	var bufferSourceProperties = {};

	['buffer', 'loop', 'loopStart', 'loopEnd'].forEach(function(name) {
		Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
	});

	// TODO: playbackRate which needs to be an AudioParam

	node.start = function(when, offset, duration) {
		// console.log('start', 'when', when, 'offset', offset, 'duration', duration);

		var buffer = bufferSourceProperties['buffer'];
		if(!buffer) {
			console.info('no buffer to play so byeee');
			return;
		}

		when = when !== undefined ? when : 0;
		offset = offset !== undefined ? offset : 0;
		
		// TODO This is mega ugly but urgh what is going on urgh
		// if I just pass 'undefined' as duration Chrome doesn't play anything
		if(window.webkitAudioContext) {
			console.log('correcting for chrome aghh');
			var sampleLength = buffer.length;
			duration = duration !== undefined ? duration : sampleLength - offset;
		}

		// TODO disconnect if existing

		initialiseBufferSource();

		bufferSource.start(when, offset, duration);

	};

	node.stop = function(when) {
		bufferSource.stop(when);
	};

	node.cancelScheduledEvents = function(when) {
		// TODO: when there is automation
	};

	function initialiseBufferSource() {
		
		bufferSource = context.createBufferSource();
		bufferSource.onended = onEnded;
		bufferSource.connect(node);

		Object.keys(bufferSourceProperties).forEach(function(name) {
			bufferSource[name] = bufferSourceProperties[name];
		});

	}

	function onEnded(e) {
		var t = e.target;
		t.disconnect(node);
		initialiseBufferSource();
	}

	function makeBufferSourceGetterSetter(property) {
		return {
			get: function() {
				return getBufferSourceProperty(property);
			},
			set: function(v) {
				setBufferSourceProperty(property, v);
			},
			enumerable: true
		};
	}

	function getBufferSourceProperty(name) {
		return bufferSourceProperties[name];
	}

	function setBufferSourceProperty(name, value) {

		bufferSourceProperties[name] = value;

		if(bufferSource) {
			bufferSource[name] = value;
		}

	}

	return node;
}

module.exports = SamplePlayer;
