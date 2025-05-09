const KeyInput = new (function () {
	const listenerEvents = new Map();

	/**
	 * What happens when a key is pressed.
	 * @param {KeyboardEvent} keyPressEvent
	 */
	function onKeyDown(keyPressEvent) {
		const key = keyPressEvent.key; // "a", "1", "Shift", etc.

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

	/**
	 * Set a listener for key presses.
	 * @param {string} key The name of this listener.
	 * @param {function(KeyboardEvent): void} fn The function to run.
	 */
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
