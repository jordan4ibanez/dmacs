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

const miniBuffer = {};

/**
 * This is shorthand for getting the minibuffer.
 * @returns The minibuffer.
 */
miniBuffer.get = () => {
	return document.getElementById("minibuffer");
};

/**
 * Interactive mode allows the buffer to intake user input.
 * @param {function(key)} fn The function to record key input
 * @param {object} initial The initial data. {readonly: mutable:}
 */
miniBuffer.interactiveMode = (fn, initial) => {
	var minibuffer = document.getElementById("minibuffer");

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

	// miniBuffer.onblur = () => {
	// 	print("lost focus");
	// 	keyInput.removeListener("minibufferlistener");
	// };
};
