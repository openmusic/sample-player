# openmusic-sample-player

> Provides an abstraction on top of BufferSourceNodes so samples can be played without regenerating the node when ended

[![Install with NPM](https://nodei.co/npm/openmusic-sample-player.png?downloads=true&stars=true)](https://nodei.co/npm/openmusic-sample-player/)

## Usage

Install first: `npm install openmusic-sample-player`.

Then you can use it in your code:

```javascript
var SamplePlayer = require('openmusic-sample-player');

var audioContext = new AudioContext();
var player = SamplePlayer(audioContext);

// suppose you have a BufferSource in `buffer` already

player.buffer = buffer;

// if you want to make it loop
player.loop = true;

// and start playing!
player.start();

```

Multiple plays can be scheduled:

```javascript
var now = audioContext.currentTime;
player.start(now + 1); // play in 1 second
player.start(now + 2); // play in 2 seconds
player.start(now + 3); // play in 3 seconds
// ...
player.stop(); // stop all scheduled plays
```


## Demo

** YOU NEED SUPPORT FOR WEB COMPONENTS IN YOUR BROWSER BECAUSE WE'RE NOT SHIMMING ANYTHING IN **

Firefox: go to `about:config`, find `dom.webcomponents.enabled` and set it to true.

Chrome: maybe nothing to do?

Run `npm install` so it installs stuff for the demo. Then `gulp build`, and then you can open `build/index.html` for the demo.

If you do changes in the code, you'll need to rebuild the demo. Use `gulp build` or `gulp` only for running `build` and setting up a `watch` loop that automatically rebuilds the demo as you change its files.

