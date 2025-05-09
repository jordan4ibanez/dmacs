const KeyInput = new (function () {
	

	/**
	 * What happens when a key is pressed.
	 * @param {KeyboardEvent} keyPressEvent
	 */
	function onKeyDown(keyPressEvent) {
		// const key = keyPressEvent.key; // "a", "1", "Shift", etc.
		for (var [_, v] of keyDownListenerEvents) {
			v(keyPressEvent);
		}
	}

	/**
	 *  What happens when a key is released.
	 * @param {KeyboardEvent} keyReleaseEvent
	 */
	function onKeyUp(keyReleaseEvent) {
		// const key = keyReleaseEvent.key; // "a", "1", "Shift", etc.
		// print(key, "UP");
	}

	

	Init.deployFunction(() => {
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
	});
})();
