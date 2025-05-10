var cssClassContainer: { [id: string]: { [id: string]: string } } = {};

/**
 * Updates the CSS of the page.
 */
function rebuild(): void {
	var rebuild: string[] = [];

	rebuild.push("\n");

	for (let [clazz, component] of Object.entries(cssClassContainer)) {
		if (clazz === "*") {
			rebuild.push(`${clazz} {\n`);
		} else {
			rebuild.push(`.${clazz} {\n`);
		}

		for (let [key, value] of Object.entries(component)) {
			// print(key, value);
			rebuild.push(`  ${key}: ${value};\n`);
		}
		rebuild.push(`}\n\n`);
	}

	const f: string = rebuild.join("");
	// console.log(f);

	var sc: HTMLElement | null = document.getElementById("SuperCSS");
	if (!sc) {
		writeln("warning: SuperCSS is gone!");
		return;
	}
	sc.textContent = f;
}

/**
 * Set CSS through javascript.
 * @param clazzOrBulk Which class this will work on. Or, a super-bulk set object.
 * @param keyOrBulk The key. Or, Object if you want to bulk set. If clazzOrBulk is an object, this has no effect.
 * @param value The value. If (clazzOrBulk or keyOrBulk) is an object, this has no effect.
 */
export function set(
	clazzOrBulk: string | { [id: string]: { [id: string]: string } },
	keyOrBulk?: string | { [id: string]: string },
	value?: any
): void {
	if (typeof clazzOrBulk === "string") {
		if (cssClassContainer[clazzOrBulk] == null) {
			cssClassContainer[clazzOrBulk] = {};
		}

		//? Non bulk.
		if (typeof keyOrBulk === "string") {
			cssClassContainer[clazzOrBulk][keyOrBulk] = value;

			//? Semi-bulk.
		} else if (typeof keyOrBulk === "object") {
			for (let [key, value] of Object.entries(keyOrBulk)) {
				cssClassContainer[clazzOrBulk][key] = value;
			}
		} else {
			throw new Error("wrong type! [1]");
		}

		//? Bulk.
	} else if (typeof clazzOrBulk === "object") {
		for (let [clazz, entry] of Object.entries(clazzOrBulk)) {
			if (typeof entry !== "object") {
				throw new Error(
					"Bulk needs to use objects to define the class!"
				);
			}
			if (cssClassContainer[clazz] == null) {
				cssClassContainer[clazz] = {};
			}
			for (let [key, value] of Object.entries(entry)) {
				if (typeof key === "string") {
					if (typeof value === "string") {
						cssClassContainer[clazz][key] = value;
					} else {
						throw new Error("key is not a string");
					}
				} else {
					throw new Error("key is not a string.");
				}
			}
		}
	} else {
		throw new Error("wrong type! [2]");
	}

	rebuild();
}

//? END IMPLEMENTATION.

export function z____deploy() {
	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);

	//* Loading the default CSS.
	set({
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
