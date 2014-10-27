function SamplePlayer(context) {
	var node = context.createGain();
	var bufferSource;
	var bufferSourceProperties = {};

	['buffer', 'loop'].forEach(function(name) {
		Object.defineProperty(node, name, makeBufferSourceGetterSetter(name));
	});

	initialiseBufferSource();

	node.start = function(when, offset, duration) {
		when = when !== undefined ? when : 0;
		offset = offset !== undefined ? offset : 0;

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
			console.log('setting prop', name);
			bufferSource[name] = bufferSourceProperties[name];
		});

		// TODO expose properties as audioparams
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

	function setBufferSourceProperty(name, value) {
		
		bufferSourceProperties[name] = value;

		if(bufferSource !== null) {
			bufferSource[name] = value;
		}

	}

	return node;
}

module.exports = SamplePlayer;
