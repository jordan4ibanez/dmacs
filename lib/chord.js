const Chord = new (function () {
	/** @type {boolean} */
	var inChord = false;
	/** @type {string} */
	var currentChord = "";
	/** @type {number} */
	var chordCount = 0;

	//? Note: This is set up slightly differently than emacs.
	//? Emacs kind of forces you to cramp your hand and that hurt mine.
	//? So, you can just hit C-M-x, etc, and it'll work the same.

	const metaKeys = { Control: "C", Alt: "M" };

	/**
	 * This is the logic that chord uses to chord. :D
	 * @param {KeyboardEvent} keyPressEvent
	 * @returns null
	 */
	this.doLogic = (keyPressEvent) => {
		// Do not record a new chord if interacting with the mini buffer.
		if (MiniBuffer.isInInteractiveMode()) {
			this.exitRecord();
			return;
		}

		if (!inChord) {
			for (const [key, value] of Object.entries(metaKeys)) {
				if (key === keyPressEvent.key) {
					currentChord = value;
					inChord = true;
					chordCount++;
					break;
				}
			}
			if (inChord) {
				MiniBuffer.setLabel("Chord: ");
				MiniBuffer.setBuffer(currentChord);
				MiniBuffer.flush();
			}
		} else {
            
		}
	};

	/**
	 * Cancel the current recording, if any.
	 * Resets the state.
	 */
	this.exitRecord = () => {
		if (inChord) {
			inChord = false;
			currentChord = "";
			chordCount = 0;
		}
	};

	(() => {
		// todo: Register the default chords.
	})();

	Init.deployFunction(() => {
		KeyInput.setListener("chord_recorder_5000", this.doLogic);
	});
})();
