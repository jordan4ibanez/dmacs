var ____deployed: boolean = false;

export function ____deploy() {
	if (____deployed) {
		throw new Error("CSS initialized twice.");
	}
	____deployed = true;

	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
}

var cssClassContainer: Map<string, string> = new Map();

/**
 * Updates the CSS of the page.
 */
export function rebuild() {
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
