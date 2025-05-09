const MiniBuffer = new (function () {
	var __inInteractiveMode = false;
	var __lastInteractive = null;
	var reentry = false;

	this.deployMiniBuffer = () => {
		var __mbDiv = document.createElement("div");
		__mbDiv.style.padding = "6px";
		__mbDiv.style.width = "calc(100% - 4px)";
		document.getElementById("secretMasterContainer").appendChild(__mbDiv);

		var mb = document.createElement("input");
		mb.className = "minibuffer";
		mb.id = "minibuffer";
		mb.readonly = "";
		mb.mutable = "";

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
			if (!__inInteractiveMode && __lastInteractive) {
				reentry = true;
				// If it was able to re-enter this interaction, it's not clickout cancel.
				this.enterInteractiveMode(false, __lastInteractive, null);
			}
		};

		mb.contentEditable = true;

		__mbDiv.append(mb);
	};

	/**
	 * This is shorthand for getting the minibuffer.
	 * @returns The minibuffer.
	 */
	this.get = () => {
		return document.getElementById("minibuffer");
	};

	this.flush = () => {
		var mb = this.get();
		mb.value = mb.readonly + mb.mutable;
	};

	/**
	 * Interactive mode allows the buffer to intake user input.
	 * @param {boolean} clickOutCancel If the user can click out to cancel the interaction. If false, it just pauses. (defaults true)
	 * @param {function(key)} fn The function to record key input
	 * @param {object} initial The initial data. {readonly: mutable:}
	 * @returns {boolean} True if it's busy with an interaction.
	 */
	this.enterInteractiveMode = (clickOutCancel, fn, initial) => {
		if (__inInteractiveMode) {
			return true;
		}

		var mb = this.get();

		mb.focus();

		// Do not clear this if re-entering an interaction.
		if (!reentry) {
			mb.readonly = "";
			mb.mutable = "";
			reentry = false;
		}

		if (initial) {
			if (initial.mutable && typeof initial.mutable === "string") {
				mb.mutable = initial.mutable;
			}
			if (initial.readonly && typeof initial.readonly === "string") {
				mb.readonly = initial.readonly;
			}
		}

		mb.value = mb.readonly + mb.mutable;

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
			mb.mutable = "";
			mb.readonly = "";
			this.flush();
			__lastInteractive = null;
		}
	};
})();
