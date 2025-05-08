/**
 * Create a split pane.
 * @param {string} id The ID of this split. It's 2 children will prepend left_ and right_ to this.
 * @param {Node} attachTo The HTML node to attach this split to.
 * @param {*} orientation Horizontal or vertical.
 * @returns A split div node parent.
 */
function createSplit(id, attachTo, orientation) {
	var newSplit = document.createElement("div");
	newSplit.className = "split";
	newSplit.id = id;
	newSplit.style.height = "100%";
	newSplit.style.width = "100%";
	newSplit.style.minWidth = "0px";
	newSplit.style.minHeight = "0px";

	if (orientation == null) {
		orientation = "horizontal";
	}

	if (orientation === "horizontal") {
		newSplit.style.flexDirection = "row";
	} else if (orientation === "vertical") {
		newSplit.style.flexDirection = "column";
	} else {
		throw new Error("Wrong orientation.");
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

	Split([`#left_${id}`, `#right_${id}`], {
		direction: orientation,
		minSize: 40,
	});

	return newSplit;
}

/**
 * Create a textarea node.
 * @param {string} id The ID of this text area.
 * @param {*} buffer Which text buffer this text area is attached to.
 * @returns Textarea node.
 */
function createTextArea(id, buffer) {
	if (buffer == null) {
		buffer = "*scratch*";
	}
	if (id == null) {
		throw new Error("id is null");
	}

	const newTextArea = document.createElement("textarea");

	newTextArea.id = id;
	newTextArea.style.width = "100%";
	newTextArea.style.height = "100%";
	newTextArea.style.resize = "none";
	newTextArea.style.minWidth = "0px";
	newTextArea.style.minHeight = "0px";

	newTextArea.style.border = "1px solid darkgray";

	newTextArea.addEventListener("input", () => {
		// println(newTextArea.value);
	});

	return newTextArea;
}
