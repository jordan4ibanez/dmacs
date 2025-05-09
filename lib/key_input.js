const KeyInput = new (function () {
	const listenerEvents = new Map();

	function onKeyDown(keyPressEvent) {
		const key = keyPressEvent.key; // "a", "1", "Shift", etc.

		Chord.tryStartRecord(keyPressEvent);

		for (var [_, v] of listenerEvents) {
			v(keyPressEvent);
		}
	}

	function onKeyUp(keyReleaseEvent) {
		const key = keyReleaseEvent.key; // "a", "1", "Shift", etc.

		// print(key, "UP");
	}

	this.setListener = (key, fn) => {
		// This will override any listeners.
		listenerEvents.set(key, fn);
	};

	this.removeListener = (key) => {
		listenerEvents.delete(key);
	};

	Init.deployFunction(() => {
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
	});
})();
