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
