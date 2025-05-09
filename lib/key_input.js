const listenerEvents = new Map();

function onKeyDown(event) {
	const key = event.key; // "a", "1", "Shift", etc.

	// print(key, "DOWN");

	for (var [_, v] of listenerEvents) {
		v(event);
	}
}

function onKeyUp(event) {
	const key = event.key; // "a", "1", "Shift", etc.

	// print(key, "UP");
}

const keyInput = {};

keyInput.setListener = (key, fn) => {
	// This will override any listeners.
	listenerEvents.set(key, fn);
};

keyInput.removeListener = (key) => {
	listenerEvents.delete(key);
};

Init.deployFunction(() => {
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
});
