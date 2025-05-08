function close_window() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

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

	return newTextArea;
}

function jsMain() {
	createBuffer("*scratch*");

	var styles = `
.split {
    display: flex;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
    cursor: row-resize;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
`;

	// todo: make this an entire thing you can use to work with css cause I'm insane.
	var styleSheet = document.createElement("style");
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);

	{
		// Create the frame to put the textareas on.
		const masterSplit = createSplit(
			"master_split",
			document.body,
			"horizontal"
		);
	}

	// console.log(document.body.innerHTML);

	document
		.getElementById("left_master_split")
		.appendChild(createTextArea("base1"));

	document
		.getElementById("right_master_split")
		.appendChild(createTextArea("base2"));

	//! All of a sudden, CTRL-X 3 and SPLIT!

	document.getElementById("base2").remove();

	{
		const masterSplit = createSplit(
			"secondary_split",
			document.getElementById("right_master_split"),
			"vertical"
		);

		document
			.getElementById("left_secondary_split")
			.appendChild(createTextArea("base2"));

		document
			.getElementById("right_secondary_split")
			.appendChild(createTextArea("base3"));
	}

	// document.appendChild(x);
}

// onload = function(){

// };
