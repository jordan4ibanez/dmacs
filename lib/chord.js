const Chord = new (function () {
	var inChord = false;

	this.doLogic = (keyPressEvent) => {
		// Do not record a new chord if interacting with the mini buffer.
		if (MiniBuffer.isInInteractiveMode()) {
			return;
		}

		print("start recording");
	};
})();
