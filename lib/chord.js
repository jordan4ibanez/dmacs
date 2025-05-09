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
			this.cancelRechording();
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
				var mb = MiniBuffer.get();
				mb.readonly = "Chord: ";
				mb.mutable = currentChord;
				MiniBuffer.flush();
			}
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
