const keyDownListenerEvents = new Map();

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
