deployFunction(() => {
	var styleSheet = document.createElement("style");
	styleSheet.id = "SuperCSS";
	styleSheet.textContent = "";
	document.head.appendChild(styleSheet);
});

var cssClassThings = {};

const css = {};

/**
 * Updates the CSS of the page.
 */
css.rebuild = () => {
	var rebuild = [];
	rebuild.push("\n");
	for (let [clazz, component] of Object.entries(cssClassThings)) {
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

	const f = rebuild.join("");
	// console.log(f);
	document.getElementById("SuperCSS").textContent = f;
};

/**
 * Set CSS through javascript.
 * @param {string | object} clazzOrBulk Which class this will work on. Or, a super-bulk set object.
 * @param {string | object} keyOrBulk The key. Or, Object if you want to bulk set. If clazzOrBulk is an object, this has no effect.
 * @param {*} value The value. If (clazzOrBulk or keyOrBulk) is an object, this has no effect.
 */
css.set = (clazzOrBulk, keyOrBulk, value) => {
	const typeClassOrBulk = typeof clazzOrBulk;

	if (typeClassOrBulk === "string") {
		const typeKeyOrBulk = typeof keyOrBulk;

		if (cssClassThings[clazzOrBulk] == null) {
			cssClassThings[clazzOrBulk] = {};
		}

		//? Non bulk.
		if (typeKeyOrBulk === "string") {
			cssClassThings[clazzOrBulk][keyOrBulk] = value;
			//? Semi-bulk.
		} else if (typeKeyOrBulk === "object") {
			for (let [key, value] of Object.entries(keyOrBulk)) {
				cssClassThings[clazzOrBulk][key] = value;
			}
		} else {
			throw new Error("wrong type! [1]");
		}
		//? Bulk.
	} else if (typeClassOrBulk === "object") {
		for (let [clazz, entry] of Object.entries(clazzOrBulk)) {
			if (typeof entry !== "object") {
				throw new Error(
					"Bulk needs to use objects to define the class!"
				);
			}
			if (cssClassThings[clazz] == null) {
				cssClassThings[clazz] = {};
			}

			for (let [key, value] of Object.entries(entry)) {
				cssClassThings[clazz][key] = value;
			}
		}
	} else {
		throw new Error("wrong type! [2]");
	}

	css.rebuild();
};
