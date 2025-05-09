export enum Orientation {
	vertical,
	horizontal,
}

/**
 * Create a split pane.
 * @param id The ID of this split. It's 2 children will prepend left_ and right_ to this.
 * @param attachTo The HTML node to attach this split to.
 * @param orientation Horizontal or vertical.
 * @returns A split div node parent.
 */
export function createSplit(
	id: string,
	attachTo: Node,
	orientation: Orientation
): HTMLElement {
	var newSplit = document.createElement("div");
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

	// todo: fix this.
	// Split([`#left_${id}`, `#right_${id}`], {
	// 	direction: orientation,
	// 	minSize: 40,
	// });

	return newSplit;
}
