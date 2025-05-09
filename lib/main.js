function close_window() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

function loadDefaultCSS() {
	CSS.set({
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
		textarea: {
			border: "1px solid darkgray",
			width: "100%",
			height: "100%",
			resize: "none",
			"min-width": "0px",
			"min-height": "0px",
		},
		"textarea:focus": {
			outline: "none !important",
			"border-color": "#719ECE",
			"box-shadow": "0 0 10px #719ECE",
		},

		minibuffer: {
			border: "1px solid darkgray",
			width: "100%",
			position: "relative",
			width: "calc(100% + 3px)",
			left: "-6px",
			top: "2px",
			"user-drag": "none",
		},
		"minibuffer:focus": {
			outline: "none !important",
			"border-color": "#719ECE",
			"box-shadow": "0 0 10px #719ECE",
		},
	});
}

function jsMain() {
	createBuffer("*scratch*");

	loadDefaultCSS();

	// The secret element is the master container.
	const secretElement = document.createElement("div");
	secretElement.className = "container";
	secretElement.id = "secretMasterContainer";
	secretElement.style.height = "calc(100% - 26px)";
	document.body.appendChild(secretElement);

	// Create the frame to put the textareas on.
	WindowControl.createSplit("master_split", secretElement, "horizontal");

	MiniBuffer.deployMiniBuffer();

	document
		.getElementById("left_master_split")
		.appendChild(WindowControl.createTextArea("base1"));

	document
		.getElementById("right_master_split")
		.appendChild(WindowControl.createTextArea("base2"));

	//! All of a sudden, CTRL-X 3 and SPLIT!

	document.getElementById("base2").remove();

	{
		const masterSplit = WindowControl.createSplit(
			"secondary_split",
			document.getElementById("right_master_split"),
			"vertical"
		);

		document
			.getElementById("left_secondary_split")
			.appendChild(WindowControl.createTextArea("base2"));

		document
			.getElementById("right_secondary_split")
			.appendChild(WindowControl.createTextArea("base3"));
	}

	testMiniBuffer();
}

// onload = function(){

// };

const testMiniBuffer = () => {
	MiniBuffer.enterInteractiveMode(
		false,
		(e) => {
			var mb = MiniBuffer.get();
			// minibuffer.readonly = ;

			const input = e.key;
			if (input === "Enter") {
				print("you typed: " + mb.mutable);
				MiniBuffer.exitInteractiveMode();
				return;
			}

			for (const a of [
				"Delete",
				"Control",
				"Shift",
				"Alt",
				"ContextMenu",
				"Tab",
				"CapsLock",
			]) {
				if (a === input) {
					return;
				}
			}

			if (input === "Backspace") {
				mb.mutable = mb.mutable.slice(0, -1);
			} else {
				mb.mutable = mb.mutable + input;
			}

			MiniBuffer.flush();

			// eventKey.key;
		},
		{
			mutable: "minibuffer test: ",
		}
	);
};
