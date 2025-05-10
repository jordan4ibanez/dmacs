import * as Buffer from "./buffer";
import * as KeyInput from "./key_input";

var __inInteractiveMode: boolean = false;
var __lastInteractive: ((a: KeyboardEvent) => void) | null = null;
var reentry: boolean = false;
var __eventListener: (() => void) | null = null;

export class MiniBuffer extends HTMLInputElement {
	label: string = "";
	buffer: string = "";
}

/**
 * Deploy the mini buffer. If this is called more than once it will error.
 */
export function deployMiniBuffer(): void {
	if (document.getElementById("minibuffer")) {
		throw new Error("Mini buffer initialized twice.");
	}

	var __mbArea = document.createElement("div");
	__mbArea.style.padding = "6px";
	__mbArea.style.width = "calc(100% - 4px)";

	var rootNode: HTMLElement | null = document.getElementById("root");
	if (!rootNode) {
		throw new Error("The root node is null.");
	}
	rootNode.appendChild(__mbArea);

	var mb = document.createElement("input") as MiniBuffer;
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
			enterInteractiveMode(false, __lastInteractive, null);
		}
	};

	mb.contentEditable = "true";

	__mbArea.append(mb);
}

/**
 * This is shorthand for getting the minibuffer. This will error if the minibuffer is null.
 * @returns The minibuffer.
 */
function get(): MiniBuffer {
	var b: HTMLElement | null = document.getElementById("minibuffer");
	if (!b) {
		throw new Error("Minibuffer is null");
	}
	return b as MiniBuffer;
}

/**
 * Updates the text in the minibuffer.
 */
export function flush(): void {
	var mb: MiniBuffer = get();
	mb.value = mb.label + mb.buffer;
}

/**
 * Set the text label of the mini buffer.
 * @param str The text to set the label to.
 */
export function setLabel(str: string): void {
	get().label = str;
}

/**
 * Get the text label of the mini buffer.
 * @returns The current label.
 */
export function getLabel(): string {
	return get().label;
}

/**
 * Set the text buffer of the mini buffer.
 * @param str New buffer text.
 */
export function setBuffer(str: string): void {
	get().buffer = str;
}

/**
 * Get the text buffer of the mini buffer.
 * @returns The current buffer text.
 */
export function getBuffer(): string {
	return get().buffer;
}

/**
 * Get if the mini buffer is currently being interacted with.
 * @returns If in interactive mode.
 */
export function isInInteractiveMode(): boolean {
	return __inInteractiveMode;
}

/**
 * Get if the mini buffer has a pending function that the user can interact with.
 * @returns If has a pending interaction.
 */
export function hasPendingInteractive(): boolean {
	return __lastInteractive != null;
}

/**
 * Reset the mini buffer.
 */
export function reset(): void {
	var mb: MiniBuffer = get();
	mb.buffer = "";
	mb.label = "";
	flush();
	__lastInteractive = null;
}

/**
 * Interactive mode allows the buffer to intake user input.
 * @param clickOutCancel If the user can click out to cancel the interaction. If false, it just pauses. (defaults true)
 * @param fn The function to record key input.
 * @param initial The initial data. {label: string, buffer: string}
 * @returns True if it's busy with an interaction.
 */
export function enterInteractiveMode(
	clickOutCancel: boolean,
	fn: (a: KeyboardEvent) => void,
	initial: { [id: string]: string } | null
): boolean {
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

	__eventListener = () => {
		exitInteractiveMode(clickOutCancel);
	};

	mb.addEventListener("blur", __eventListener);

	__inInteractiveMode = true;

	return false;
}

/**
 * Exit interactive mode.
 * @param shutDownCurrentScope If you want to let the user click back into the minibuffer to re-enter interactive mode, set this to false.
 */
export function exitInteractiveMode(
	shutDownCurrentScope: boolean = true
): void {
	var mb: MiniBuffer = get();

	KeyInput.removeListener("minibufferlistener");
	if (__eventListener) {
		mb.removeEventListener("blur", __eventListener);
	} else {
		writeln("Warning: Mini buffer event listener was null.");
	}
	__inInteractiveMode = false;

	// This basically makes it impossible for the user to click back into the function scope.
	if (shutDownCurrentScope) {
		reset();
	}
}
