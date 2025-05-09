const MiniBuffer = {};
const self = MiniBuffer;

var __inInteractiveMode = false;
var __lastInteractive = null;

self.deployMiniBuffer = () => {
	var __mbDiv = document.createElement("div");
	__mbDiv.style.padding = "6px";
	__mbDiv.style.width = "calc(100% - 4px)";
	document
		.getElementById("secretMasterContainer")
		.appendChild(__mbDiv);

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
			// If it was able to re-enter this interaction, it's not clickout cancel.
			miniBuffer.enterInteractiveMode(false, __lastInteractive, null);
		}
	};

	mb.contentEditable = true;

	__mbDiv.append(mb);
};

/**
 * This is shorthand for getting the minibuffer.
 * @returns The minibuffer.
 */
miniBuffer.get = () => {
	return document.getElementById("minibuffer");
};

miniBuffer.flush = () => {
	var minibuffer = miniBuffer.get();
	minibuffer.value = minibuffer.readonly + minibuffer.mutable;
};

/**
 * Interactive mode allows the buffer to intake user input.
 * @param {function(key)} fn The function to record key input
 * @param {object} initial The initial data. {readonly: mutable:}
 * @param {boolean} clickOutCancel If the user can click out to cancel the interaction. If false, it just pauses. (defaults true)
 * @returns {boolean} True if it's busy with an interaction.
 */
miniBuffer.enterInteractiveMode = (clickOutCancel, fn, initial) => {
	if (__inInteractiveMode) {
		return true;
	}

	var minibuffer = miniBuffer.get();

	minibuffer.focus();

	miniBuffer.readonly = "";
	miniBuffer.mutable = "";

	if (initial) {
		if (initial.mutable && typeof initial.mutable === "string") {
			minibuffer.mutable = initial.mutable;
		}
		if (initial.readonly && typeof initial.readonly === "string") {
			minibuffer.readonly = initial.readonly;
		}
	}

	minibuffer.value = minibuffer.readonly + minibuffer.mutable;

	keyInput.setListener("minibufferlistener", fn);
	__lastInteractive = fn;

	minibuffer.addEventListener("blur", () => {
		miniBuffer.exitInteractiveMode(clickOutCancel);
	});

	__inInteractiveMode = true;
};

miniBuffer.exitInteractiveMode = (shutDownCurrentScope = true) => {
	var minibuffer = miniBuffer.get();

	keyInput.removeListener("minibufferlistener");
	minibuffer.removeEventListener("blur", minibuffer);
	__inInteractiveMode = false;

	// This basically makes it impossible for the user to click back into the function scope.
	if (shutDownCurrentScope) {
		minibuffer.mutable = "";
		minibuffer.readonly = "";
		miniBuffer.flush();
		__lastInteractive = null;
	}
};
