const MiniBuffer = new (function () {
	var __inInteractiveMode = false;
	var __lastInteractive = null;
	var reentry = false;

	this.deployMiniBuffer = () => {
		var __mbArea = document.createElement("div");
		__mbArea.style.padding = "6px";
		__mbArea.style.width = "calc(100% - 4px)";
		document.getElementById("root").appendChild(__mbArea);

		var mb = document.createElement("input");
		mb.className = "minibuffer";
		mb.id = "minibuffer";
		mb.label = "";
		mb.buffer = "";

		/// https://stackoverflow.com/a/54709613
		mb.oncut = () => {
			return false;
		};
		mb.onpaste = () => {
			return false;
		};
		mb.onkeydown = () => {
			return false;
		};
		mb.ondragenter = () => {
			return false;
		};
		mb.ondragleave = () => {
			return false;
		};
		mb.ondragover = () => {
			return false;
		};
		mb.ondrop = () => {
			return false;
		};
		mb.onfocus = () => {
			Buffer.setFocus(mb.id);
		};

		mb.onfocus = () => {
			if (!__inInteractiveMode && __lastInteractive) {
				reentry = true;
				// If it was able to re-enter this interaction, it's not clickout cancel.
				this.enterInteractiveMode(false, __lastInteractive, null);
			}
		};

		mb.contentEditable = true;

		__mbArea.append(mb);
	};

	/**
	 * This is shorthand for getting the minibuffer.
	 * @returns The minibuffer.
	 */
	const get = () => {
		return document.getElementById("minibuffer");
	};

	/**
	 * Updates the text in the minibuffer.
	 */
	this.flush = () => {
		var mb = get();
		mb.value = mb.label + mb.buffer;
	};

	/**
	 * Set the text label of the mini buffer.
	 * @param {string} str New label.
	 */
	this.setLabel = (str) => {
		get().label = str;
	};

	/**
	 * Get the text label of the mini buffer.
	 * @returns The current label.
	 */
	this.getLabel = () => {
		return get().label;
	};

	/**
	 * Set the text buffer of the mini buffer.
	 * @param {string} str New text.
	 */
	this.setBuffer = (str) => {
		get().buffer = str;
	};

	/**
	 * Get the text buffer of the mini buffer.
	 * @returns The current buffer text.
	 */
	this.getBuffer = () => {
		return get().buffer;
	};

	/**
	 * Get if the mini buffer is currently being interacted with.
	 * @returns If in interactive mode.
	 */
	this.isInInteractiveMode = () => {
		return __inInteractiveMode;
	};

	/**
	 * Reset the mini buffer.
	 */
	this.reset = () => {
		mb.buffer = "";
		mb.label = "";
		this.flush();
		__lastInteractive = null;
	};

	/**
	 * Interactive mode allows the buffer to intake user input.
	 * @param {boolean} clickOutCancel If the user can click out to cancel the interaction. If false, it just pauses. (defaults true)
	 * @param {function(key)} fn The function to record key input
	 * @param {object} initial The initial data. {label: string, buffer: string}
	 * @returns {boolean} True if it's busy with an interaction.
	 */
	this.enterInteractiveMode = (clickOutCancel, fn, initial) => {
		if (__inInteractiveMode) {
			return true;
		}

		var mb = get();

		mb.focus();

		// Do not clear this if re-entering an interaction.
		if (!reentry) {
			mb.label = "";
			mb.buffer = "";
			reentry = false;
		}

		if (initial) {
			if (initial.buffer && typeof initial.buffer === "string") {
				mb.buffer = initial.buffer;
			}
			if (initial.label && typeof initial.label === "string") {
				mb.label = initial.label;
			}
		}

		mb.value = mb.label + mb.buffer;

		KeyInput.setListener("minibufferlistener", fn);
		__lastInteractive = fn;

		mb.addEventListener("blur", () => {
			this.exitInteractiveMode(clickOutCancel);
		});

		__inInteractiveMode = true;
	};

	this.exitInteractiveMode = (shutDownCurrentScope = true) => {
		var mb = MiniBuffer.get();

		KeyInput.removeListener("minibufferlistener");
		mb.removeEventListener("blur", mb);
		__inInteractiveMode = false;

		// This basically makes it impossible for the user to click back into the function scope.
		if (shutDownCurrentScope) {
			this.reset();
		}
	};
})();
