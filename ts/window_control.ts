import * as Split from "./split";
import * as MiniBuffer from "./mini_buffer";
import * as Buffer from "./buffer";

var currentFocus: string = "";
var __nextID = 0;

export enum Orientation {
	vertical = "vertical",
	horizontal = "horizontal",
}

export class SplitViewDivs {
	left: HTMLDivElement;
	right: HTMLDivElement;
	constructor(left: HTMLDivElement, right: HTMLDivElement) {
		this.left = left;
		this.right = right;
	}
}

/**
 * Create a split pane.
 * @param id The ID of this split. It's 2 children will prepend left_ and right_ to this.
 * @param attachTo The HTML node to attach this split to.
 * @param orientation Horizontal or vertical.
 * @returns An object that holds the two split divs.
 */
function createSplit(
	id: string,
	attachTo: Node,
	orientation: Orientation
): SplitViewDivs {
	var newSplit: HTMLDivElement = document.createElement("div");
	newSplit.className = "split";
	newSplit.id = id;
	newSplit.style.height = "100%";
	newSplit.style.width = "100%";
	newSplit.style.minWidth = "0px";
	newSplit.style.minHeight = "0px";

	if (orientation === Orientation.horizontal) {
		newSplit.style.flexDirection = "row";
	} else if (orientation === Orientation.vertical) {
		newSplit.style.flexDirection = "column";
	}

	var leftSideDiv = document.createElement("div");
	leftSideDiv.id = `left_${id}`;
	leftSideDiv.style.height = "100%";
	leftSideDiv.style.width = "100%";
	leftSideDiv.style.minWidth = "0px";
	leftSideDiv.style.minHeight = "0px";
	newSplit.appendChild(leftSideDiv);

	var rightSideDiv = document.createElement("div");
	rightSideDiv.id = `right_${id}`;
	rightSideDiv.style.height = "100%";
	rightSideDiv.style.width = "100%";
	rightSideDiv.style.minWidth = "0px";
	rightSideDiv.style.minHeight = "0px";
	newSplit.appendChild(rightSideDiv);

	attachTo.appendChild(newSplit);

	Split.Split([`#left_${id}`, `#right_${id}`], {
		direction: orientation,
		minSize: 40,
	});

	return new SplitViewDivs(
		document.getElementById(`left_${id}`)! as HTMLDivElement,
		document.getElementById(`right_${id}`)! as HTMLDivElement
	);
}

function getWindowIDAndIncrement(): string {
	const thisID: number = __nextID;
	__nextID++;
	return "window_" + thisID.toString();
}

function getDivIDAndIncrement(): string {
	const thisID: number = __nextID;
	__nextID++;
	return "divider_" + thisID.toString();
}

export class WindowTextArea extends HTMLTextAreaElement {
	focusedBuffer: string = "";
}

/**
 * Create a textarea node.
 * @param id The ID of this text area.
 * @param buffer Which text buffer this text area is attached to.
 * @returns The new textarea node.
 */
function createTextArea(buffer: string = "*scratch*"): WindowTextArea {
	if (buffer == null) {
		buffer = "*scratch*";
	}

	// if (id == null) {
	// 	throw new Error("id is null");
	// }

	const newTextArea: WindowTextArea = document.createElement(
		"textarea"
	) as WindowTextArea;

	newTextArea.focusedBuffer = buffer;

	newTextArea.className = "textarea";
	newTextArea.id = getWindowIDAndIncrement();

	newTextArea.oncut = () => {
		return false;
	};
	newTextArea.onpaste = () => {
		return false;
	};
	newTextArea.onkeydown = () => {
		return false;
	};
	newTextArea.ondragenter = () => {
		return false;
	};
	newTextArea.ondragleave = () => {
		return false;
	};
	newTextArea.ondragover = () => {
		return false;
	};
	newTextArea.ondrop = () => {
		return false;
	};

	// When the user focuses (clicks) the window.
	newTextArea.onfocus = () => {
		currentFocus = newTextArea.id;

		Buffer.setFocus("*scratch*");

		writeln(
			`focused on textarea: ${currentFocus} | Buffer: ${newTextArea.focusedBuffer}`
		);
	};

	// When the user unfocuses (unclicks) on the window.
	newTextArea.onblur = () => {
		// writeln("bye");
	};

	newTextArea.tabIndex = -1;

	// newTextArea.addEventListener("input", () => {
	// println(newTextArea.value);
	// });

	return newTextArea;
}

export function split(orientation: Orientation): void {
	const gottenElement: WindowTextArea | null = window.document.getElementById(
		currentFocus
	) as WindowTextArea | null;

	if (!gottenElement) {
		writeln(`Cannot split ${currentFocus}, it does not exist.`);
		return;
	}

	//? Parent is ALWAYS a div.
	//? If it's not, then explode.
	const parent: HTMLElement = gottenElement.parentElement!;

	if (!(parent instanceof HTMLDivElement)) {
		throw new Error("not a div!");
	}

	parent.removeChild(gottenElement);
	var split: SplitViewDivs = createSplit(
		getDivIDAndIncrement(),
		parent,
		orientation
	);
	split.left.appendChild(gottenElement);
	split.right.appendChild(createTextArea(gottenElement.focusedBuffer));
	focusWindow(gottenElement.id);
}

export function destroy(): void {
	const gottenTextArea: WindowTextArea | null =
		window.document.getElementById(currentFocus) as WindowTextArea | null;

	if (!gottenTextArea) {
		writeln(`Cannot split ${currentFocus}, it does not exist.`);
		return;
	}

	//? Parent is ALWAYS a div.
	//? If it's not, then explode.
	const parent: HTMLElement = gottenTextArea.parentElement!;

	if (!(parent instanceof HTMLDivElement)) {
		throw new Error("not a div!");
	}

	if (parent.id === "window_area") {
		MiniBuffer.reset();
		MiniBuffer.setLabel("Cannot delete window. It is the only one left.");
		MiniBuffer.flush();
		return;
	}

	// Parent is always a div in the split.
	const isLeft: boolean = parent.id.startsWith("left_divider_");
	const isRight: boolean = parent.id.startsWith("right_divider_");

	if (!isLeft && !isRight) {
		throw new Error("what happened here? " + parent.id);
	}

	const ind: string = parent.id.split("_")[2]!.toString();

	// Get neighbor.
	var neighbor: HTMLElement = (() => {
		if (isLeft) {
			return document.getElementById("right_divider_" + ind)!
				.childNodes[0]!;
		} else {
			return document.getElementById("left_divider_" + ind)!
				.childNodes[0]!;
		}
	})() as HTMLElement;

	var split: HTMLDivElement = parent.parentElement! as HTMLDivElement;
	var masterDiv: HTMLDivElement = split.parentElement! as HTMLDivElement;

	parent.removeChild(gottenTextArea);
	split.removeChild(parent);
	masterDiv.removeChild(split);

	masterDiv.appendChild(neighbor);
	neighbor.style.height = "100%";
	neighbor.style.width = "100%";

	if (neighbor instanceof HTMLTextAreaElement) {
		// writeln("text");
		focusWindow(neighbor.id);
	} else {
		// writeln("div: looping");

		// This div could be a huge nesting of divs. Find the text area.

		for (let _ = 0; _ < 100; _++) {
			neighbor = neighbor.childNodes[0]! as HTMLElement;
			// writeln("ne:", neighbor.id);
			if (neighbor instanceof HTMLTextAreaElement) {
				focusWindow(neighbor.id);
				break;
			}
		}
	}
}

/**
 * Focus a window by it's ID.
 * @param id The id of the window.
 */
export function focusWindow(id: string): void {
	const unknownElement: WindowTextArea | null =
		window.document.getElementById(id) as WindowTextArea | null;

	if (!unknownElement) {
		writeln(`Cannot focus window [${id}]. It does not exist.`);
		return;
	}

	unknownElement.focus();
	currentFocus = unknownElement.id;

	Buffer.setFocus(unknownElement.focusedBuffer);
}

//? END IMPLEMENTATION.

export function z____deploy(): void {
	// The secret element is the master container.
	const rootDiv = document.createElement("div");
	rootDiv.className = "root";
	rootDiv.id = "root";
	rootDiv.style.height = "calc(100% - 26px)";
	document.body.appendChild(rootDiv);

	const windowArea = document.createElement("div");
	windowArea.className = "window_area";
	windowArea.id = "window_area";
	windowArea.style.height = "100%";
	rootDiv.appendChild(windowArea);

	MiniBuffer.deployMiniBuffer();

	// var split: SplitViewDivs = createSplit(
	// 	"testing",
	// 	windowArea,
	// 	Orientation.horizontal
	// );

	// split.left.appendChild(createTextArea("1"));
	// split.right.appendChild(createTextArea("2"));

	// Create the initial window area.
	var newWin = createTextArea();
	windowArea.appendChild(newWin);
	// writeln("hi");
	rootDiv.appendChild;

	focusWindow(newWin.id);
}
