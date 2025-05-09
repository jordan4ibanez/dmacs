var __inInteractiveMode: boolean = false;
var __lastInteractive = null; // todo: name this type
var reentry: boolean = false;

export function deployMiniBuffer() {
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
}
