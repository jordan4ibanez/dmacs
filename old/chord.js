const Chord = new (function () {
	

	



	

	/**
	 * 
	 * @param {KeyboardEvent} keyPressEvent
	 * @returns null
	 */
	this.doLogic = (keyPressEvent) => {
		
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
