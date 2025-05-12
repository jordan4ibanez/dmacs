//? BEGIN IMPLEMENTATION.

const keyDownListenerEvents: Map<string, (a: KeyboardEvent) => void> =
	new Map();

/**
 * What happens when a key is pressed.
 * @param keyPressEvent
 */
function onKeyDown(keyPressEvent: KeyboardEvent): void {
	// const key = keyPressEvent.key; // "a", "1", "Shift", etc.
	for (var [_, v] of keyDownListenerEvents) {
		v(keyPressEvent);
	}
}

/**
 * What happens when a key is released.
 * @param keyReleaseEvent
 */
function onKeyUp(_: KeyboardEvent): void {
	// const key = keyReleaseEvent.key; // "a", "1", "Shift", etc.
	// print(key, "UP");
}

/**
 * Set a listener for key presses. If it exists, it will overwrite it.
 * @param key The name of the listener.
 * @param fn The function to run.
 */
export function setListener(key: string, fn: (a: KeyboardEvent) => void): void {
	// This will override any listeners.
	keyDownListenerEvents.set(key, fn);
}

/**
 * Remove a listener. If it does not exist this has no effect.
 * @param key The name of the listener.
 */
export function removeListener(key: string): void {
	keyDownListenerEvents.delete(key);
}

//? END IMPLEMENTATION.

export function z____deploy(): void {
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
}
