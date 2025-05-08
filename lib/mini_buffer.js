const deployMiniBuffer = () => {
	var __miniBufferDiv = document.createElement("div");
	__miniBufferDiv.style.padding = "6px";
	__miniBufferDiv.style.width = "calc(100% - 4px)";
	document
		.getElementById("secretMasterContainer")
		.appendChild(__miniBufferDiv);

	var minibuffer = document.createElement("input");
	minibuffer.className = "minibuffer";
	minibuffer.id = "minibuffer";
	minibuffer.readonly = "";
	minibuffer.mutable = "";

	/// https://stackoverflow.com/a/54709613
	minibuffer.oncut = () => {
		return false;
	};
	minibuffer.onpaste = () => {
		return false;
	};
	minibuffer.onkeydown = () => {
		return false;
	};
	minibuffer.ondragenter = () => {
		return false;
	};
	minibuffer.ondragleave = () => {
		return false;
	};
	minibuffer.ondragover = () => {
		return false;
	};
	minibuffer.ondrop = () => {
		return false;
	};

	minibuffer.contentEditable = true;

	__miniBufferDiv.append(minibuffer);
};

var __inInteractiveMode = false;
var __lastInteractive = null;

const miniBuffer = {};

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
