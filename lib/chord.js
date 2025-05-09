const Chord = new (function () {
	/** @type {boolean} */
	var inChord = false;
	/** @type {string} */
	var currentChord = "";

	//? Note: This is set up slightly differently than emacs.
	//? Emacs kind of forces you to cramp your hand and that hurt mine.
	//? So, you can just hit C-M-x, etc, and it'll work the same.

	/**
	 * This is the logic that chord uses to chord. :D
	 * @param {KeyboardEvent} keyPressEvent
	 * @returns null
	 */
	this.doLogic = (keyPressEvent) => {
		// Do not record a new chord if interacting with the mini buffer.
		if (MiniBuffer.isInInteractiveMode()) {
			return;
		}

		if (!inChord) {
		} else {
		}
	};

	/**
	 * Yes this name is a pun.
	 */
	this.cancelRechording = () => {
		if (inChord) {
			inChord = false;
			currentChord = "";
		}
	};

	(() => {
		// Register the default chords.
		print("hi");
	})();
})();
