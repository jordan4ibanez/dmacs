const Buffer = new (function () {
	/** @type {string} Focused buffer name. */
	var focusedBuffer = null;

	/**
	 * Set the currently focused buffer.
	 * @param {string} bufferName The name of the buffer.
	 */
	this.setFocus = (bufferName) => {
		focusedBuffer = bufferName;
		Chord.cancelRechording();
	};

	/**
	 * Get the currently focused buffer.
	 * @returns The currently focused buffer.
	 */
	this.getFocus = () => {
		return focusedBuffer;
	};
})();
