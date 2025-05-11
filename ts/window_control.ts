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

function getIDAndIncrement(): string {
	const thisID: number = __nextID;
	__nextID++;
	return thisID.toString();
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
	newTextArea.id = getIDAndIncrement();

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
		Buffer.setFocus(newTextArea.focusedBuffer);
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
	writeln("Splitting.");
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
	windowArea.appendChild(createTextArea());

	// writeln("hi");
	rootDiv.appendChild;
}
