const KeyInput = new (function () {
	const listenerEvents = new Map();

	/**
	 * What happens when a key is pressed.
	 * @param {KeyboardEvent} keyPressEvent
	 */
	function onKeyDown(keyPressEvent) {
		const key = keyPressEvent.key; // "a", "1", "Shift", etc.

		Chord.doLogic(keyPressEvent);

		for (var [_, v] of listenerEvents) {
			v(keyPressEvent);
		}
	}

	/**
	 *  What happens when a key is released.
	 * @param {KeyboardEvent} keyReleaseEvent
	 */
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
