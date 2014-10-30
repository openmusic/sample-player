function SamplePlayer(context) {
	var node = context.createGain();
	var bufferSource;
	var bufferSourceProperties = {};

	['buffer', 'loop', 'loopStart', 'loopEnd'].forEach(function(name) {
		Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
	});

	// TODO: playbackRate which needs to be an AudioParam

	node.start = function(when, offset, duration) {
		console.log('start', 'when', when, 'offset', offset, 'duration', duration);

		var buffer = bufferSourceProperties['buffer'];
		if(!buffer) {
			console.info('no buffer to play so byeee');
			return;
		}

		var sampleLength = buffer.length;

		when = when !== undefined ? when : 0;
		offset = offset !== undefined ? offset : 0;
		duration = duration !== undefined ? duration : sampleLength - offset;

		console.info('when', when, 'offset', offset, 'duration', duration);

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
			console.log('setting prop', name, typeof bufferSourceProperties[name], bufferSourceProperties[name]);
			bufferSource[name] = bufferSourceProperties[name];

		});

	}

	function onEnded(e) {
		console.log('ended!', e);
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

	function setBufferSourceProperty(name, value) {
		
		bufferSourceProperties[name] = value;

		if(bufferSource) {
			bufferSource[name] = value;
		}

	}

	return node;
}

module.exports = SamplePlayer;
