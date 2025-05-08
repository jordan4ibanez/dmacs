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
	onpaste = () => {
		return false;
	};
	onkeydown = () => {
		return false;
	};
	ondragenter = () => {
		return false;
	};
	ondragleave = () => {
		return false;
	};
	ondragover = () => {
		return false;
	};
	ondrop = () => {
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
 */
miniBuffer.interactiveMode = (fn) => {
	var minibuffer = document.getElementById("minibuffer");

	minibuffer.focus();

	keyInput.setListener("minibufferlistener", fn);

	// miniBuffer.onblur = () => {
	// 	print("lost focus");
	// 	keyInput.removeListener("minibufferlistener");
	// };
};
