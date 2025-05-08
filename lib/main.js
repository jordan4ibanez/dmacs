function close_window() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

function loadDefaultCSS() {
	css.set({
		split: {
			display: "flex",
		},
		gutter: {
			"background-color": "#eee",
			"background-repeat": "no-repeat",
			"background-position": "50%",
		},
		"gutter.gutter-vertical": {
			"background-image": `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=')`,
			cursor: "row-resize",
		},
		"gutter.gutter-horizontal": {
			"background-image": `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')`,
			cursor: "col-resize",
		},
	});
}

function jsMain() {
	createBuffer("*scratch*");

	loadDefaultCSS();

	// The secret element is the master container.
	const secretElement = document.createElement("div");
	secretElement.className = "container";
	secretElement.style.height = "calc(100% - 20px)";
	document.body.appendChild(secretElement);

	// Create the frame to put the textareas on.
	createSplit("master_split", secretElement, "horizontal");

	var __miniBufferDiv = document.createElement("div");
	__miniBufferDiv.style.padding = "4px";
	__miniBufferDiv.style.width = "100%";
	secretElement.appendChild(__miniBufferDiv);

	var miniBuffer = document.createElement("input");
	miniBuffer.style.width = "100%";
	__miniBufferDiv.append(miniBuffer);

	console.log(document.body.innerHTML);

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
