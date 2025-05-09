const Buffer = new (function () {
	/** @type {string} */
	var focusedBuffer = null;

	/**
	 * Set the currently focused buffer.
	 * @param {string} bufferName The name of the buffer.
	 */
	this.setFocus = (bufferName) => {
		focusedBuffer = bufferName;
	};
})();
