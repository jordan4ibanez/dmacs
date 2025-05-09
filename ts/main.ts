import * as CSS from "./css";
import * as Deploy from "./init";
Deploy.z____run();

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
			// width: "100%",
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

function closeWindow() {
	if (confirm("Close Window?")) {
		dClose("hi");
	}
}

(function main() {
	createBuffer("*scratch*");
	loadDefaultCSS();
})();
