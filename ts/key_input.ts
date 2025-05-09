import * as Init from "./init";
Init.deploy("KeyInput", () => {
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
});

//? BEGIN IMPLEMENTATION.

const keyDownListenerEvents = new Map();

/**
 * What happens when a key is pressed.
 * @param {KeyboardEvent} keyPressEvent
 */
function onKeyDown(keyPressEvent: KeyboardEvent) {
	// const key = keyPressEvent.key; // "a", "1", "Shift", etc.
	for (var [_, v] of keyDownListenerEvents) {
		v(keyPressEvent);
	}
}

/**
 *  What happens when a key is released.
 * @param {KeyboardEvent} keyReleaseEvent
 */
function onKeyUp(keyReleaseEvent: KeyboardEvent) {
	// const key = keyReleaseEvent.key; // "a", "1", "Shift", etc.
	// print(key, "UP");
}

/**
 * Set a listener for key presses. If it exists, it will overwrite it.
 * @param key The name of the listener.
 * @param fn The function to run.
 */
export function setListener(key: string, fn: () => void): void {
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
